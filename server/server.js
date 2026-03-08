const express = require("express");
const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// client map serveren
app.use(express.static(path.join(__dirname, "../client")));


function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const index = trimmed.indexOf("=");
    if (index < 1) return;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(path.resolve(__dirname, ".env"));
loadEnvFile(path.resolve(__dirname, ".env.local"));
loadEnvFile(path.resolve(__dirname, "../.env"));
loadEnvFile(path.resolve(__dirname, "../.env.local"));



function readSmtpResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n").filter(Boolean);
      const last = lines[lines.length - 1] || "";

      if (/^\d{3}\s/.test(last)) {
        socket.off("data", onData);
        socket.off("error", onError);
        resolve({
          code: last.slice(0, 3),
          lines,
          text: buffer
        });
      }
    };

    const onError = (error) => {
      socket.off("data", onData);
      reject(error);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendSmtpCommand(socket, command, allowedCodes = ["250"]) {
  if (command) socket.write(`${command}\r\n`);

  const response = await readSmtpResponse(socket);
  const ok = allowedCodes.some((code) => response.code === code || response.code.startsWith(code));

  if (!ok) {
    throw new Error(`SMTP command failed: ${command || "<greeting>"} => ${response.lines.join(" | ")}`);
  }

  return response;
}

function createSmtpConnection({ host, port, secure, allowInvalidCert }) {
  return new Promise((resolve, reject) => {
    if (secure) {
      const socket = tls.connect(
        {
          host,
          port,
          rejectUnauthorized: !allowInvalidCert
        },
        () => resolve(socket)
      );
      socket.on("error", reject);
      return;
    }

    const socket = net.connect({ host, port }, () => resolve(socket));
    socket.on("error", reject);
  });
}

function upgradeToTls(socket, { host, allowInvalidCert }) {
  return new Promise((resolve, reject) => {
    const tlsSocket = tls.connect(
      {
        socket,
        servername: host,
        rejectUnauthorized: !allowInvalidCert
      },
      () => resolve(tlsSocket)
    );

    tlsSocket.on("error", reject);
  });
}

function normalizeBodyText(input) {
  return String(input)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
}

function serverSupportsStartTls(ehloResponse) {
  const joined = ehloResponse.lines.join("\n").toUpperCase();
  return joined.includes("STARTTLS");
}

async function sendMailViaSmtp(config, mail) {
  const { host, port, user, pass, secure, allowInvalidCert, from, to } = config;
  let socket = await createSmtpConnection({ host, port, secure, allowInvalidCert });

  try {
    await sendSmtpCommand(socket, "", ["220"]);
    let ehlo = await sendSmtpCommand(socket, `EHLO ${host}`, ["250"]);

    if (!secure && serverSupportsStartTls(ehlo)) {
      await sendSmtpCommand(socket, "STARTTLS", ["220"]);
      socket = await upgradeToTls(socket, { host, allowInvalidCert });
      ehlo = await sendSmtpCommand(socket, `EHLO ${host}`, ["250"]);
    }

    await sendSmtpCommand(socket, "AUTH LOGIN", ["334"]);
    await sendSmtpCommand(socket, Buffer.from(user).toString("base64"), ["334"]);
    await sendSmtpCommand(socket, Buffer.from(pass).toString("base64"), ["235"]);

    await sendSmtpCommand(socket, `MAIL FROM:<${from}>`, ["250"]);
    await sendSmtpCommand(socket, `RCPT TO:<${to}>`, ["250", "251"]);
    await sendSmtpCommand(socket, "DATA", ["354"]);

    const safeBody = normalizeBodyText(mail.text);
    const payload = [
      `From: ${from}`,
      `To: ${to}`,
      `Reply-To: ${mail.replyTo}`,
      `Subject: ${mail.subject}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      safeBody,
      "."
    ].join("\r\n");

    socket.write(`${payload}\r\n`);
    await sendSmtpCommand(socket, "", ["250"]);
    await sendSmtpCommand(socket, "QUIT", ["221"]);
  } finally {
    socket.end();
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function isPlaceholderValue(value) {
  const v = String(value || "").toLowerCase();
  return (
    v.includes("jouwdomein") ||
    v.includes("jouw_smtp") ||
    v.includes("jouw smtp") ||
    v.includes("example.com")
  );
}

function parseBool(value, fallback = false) {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function getMissingSmtpVars(config) {
  const missing = [];
  if (!config.host) missing.push("SMTP_HOST");
  if (!config.user) missing.push("SMTP_USER");
  if (!config.pass) missing.push("SMTP_PASS");
  if (!config.from) missing.push("MAIL_FROM (of SMTP_USER)");
  return missing;
}

function sanitizeValue(value) {
  if (!value) return "";
  if (value.length <= 4) return "****";
  return `${value.slice(0, 2)}****${value.slice(-2)}`;
}

function sendConfigCheckResponse(res) {
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const secureFromEnv = process.env.SMTP_SECURE;
  const config = {
    host: process.env.SMTP_HOST || "",
    port: smtpPort,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    secure: parseBool(secureFromEnv, smtpPort === 465),
    from: process.env.MAIL_FROM || process.env.SMTP_USER || "",
    to: process.env.MAIL_TO || "pcpocontact@gmail.com"
  };

  const missing = getMissingSmtpVars(config);

  return res.status(200).json({
    ok: missing.length === 0,
    missing,
    config: {
      host: config.host,
      port: config.port,
      user: sanitizeValue(config.user),
      pass: config.pass ? "******" : "",
      secure: config.secure,
      from: config.from,
      to: config.to
    }
  });
}

app.get("/api/contact/config-check", (req, res) => sendConfigCheckResponse(res));
app.get("/api/contact/configcheck", (req, res) => sendConfigCheckResponse(res));
app.get("/api/config-check", (req, res) => sendConfigCheckResponse(res));

app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Vul alle verplichte velden in." });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Ongeldig e-mailadres." });
  }

  const secureFromEnv = process.env.SMTP_SECURE;
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    secure: parseBool(secureFromEnv, smtpPort === 465),
    allowInvalidCert: parseBool(process.env.SMTP_ALLOW_INVALID_CERT, false),
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: process.env.MAIL_TO || "pcpocontact@gmail.com"
  };

  const missingVars = getMissingSmtpVars(smtpConfig);
  if (missingVars.length > 0) {
    return res.status(500).json({
      error: `Mailserver niet geconfigureerd. Ontbrekend: ${missingVars.join(", ")}.`,
      missing: missingVars
    });
  }

  if (
    isPlaceholderValue(smtpConfig.host) ||
    isPlaceholderValue(smtpConfig.user) ||
    isPlaceholderValue(smtpConfig.pass) ||
    isPlaceholderValue(smtpConfig.from)
  ) {
    return res.status(500).json({
      error:
        "Je gebruikt voorbeeldwaarden (zoals smtp.jouwdomein.nl of jouw_smtp_user). Vervang deze door je echte SMTP-gegevens."
    });
  }

  try {
    await sendMailViaSmtp(smtpConfig, {
      replyTo: email,
      subject: `[Contactformulier] ${subject}`,
      text: `Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Mail send failed:", error.message);
    return res.status(500).json({ error: `Verzenden mislukt: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Config check endpoints:");
  console.log(` - http://localhost:${PORT}/api/contact/config-check`);
  console.log(` - http://localhost:${PORT}/api/contact/configcheck`);
  console.log(` - http://localhost:${PORT}/api/config-check`);
});