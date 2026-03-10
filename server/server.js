const express = require("express");
const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const SCHOOL_DIRECTORY = [
  { name: "CBS De Ark", address: "Klipper 108-109, 2991 KM Barendrecht", city: "Barendrecht", website: "http://www.cbsdearkbarendrecht.nl/" },
  { name: "CBS De Bongerd", address: "Patrijs 28-29, 2986 CA Ridderkerk", city: "Ridderkerk", website: "https://www.cbsdebongerd.nl/" },
  { name: "CBS De Fontein", address: "Scheldeplein 4, 2987 EL Ridderkerk", city: "Ridderkerk", website: "https://www.fonteinbolnes.nl/" },
  { name: "CBS De Hoeksteen", address: "Kruidentuin 6A, 2991 RK Barendrecht", city: "Barendrecht", website: "https://www.dehoeksteen-cbs.nl/" },
  { name: "CBS De Klimop", address: "Meester Treubstraat 3, 2982 VN Ridderkerk", city: "Ridderkerk", website: "https://cbsdeklimopridderkerk.nl/" },
  { name: "CBS De Regenboog", address: "Reijerweg 60, 2983 AT Ridderkerk", city: "Ridderkerk", website: "https://www.regenboogridderkerk.nl/" },
  { name: "CBS De Vrijenburg", address: "Vrijenburglaan 61, 2994 CD Barendrecht", city: "Barendrecht", website: "https://www.cbsdevrijenburg.nl/" },
  { name: "CBS De Wingerd", address: "Da Costalaan 3, 2985 BC Ridderkerk", city: "Ridderkerk", website: "http://www.cbsdewingerd-ridderkerk.nl/" },
  { name: "CBS Groen van Prinsterer (Stellingmolen)", address: "Stellingmolen 10, 2992 DN Barendrecht", city: "Barendrecht", website: "https://www.prinsterer.nl/" },
  { name: "CBS Groen van Prinsterer (Hof van Maxima)", address: "Hedwigepolder 2, 2992 TS Barendrecht", city: "Barendrecht", website: "https://www.prinsterer.nl/" },
  { name: "CBS Het Kompas", address: "Hoefslag 20, 2992 VH Barendrecht", city: "Barendrecht", website: "https://www.kompasbarendrecht.nl/" },
  { name: "CBS Smitshoek (Riederhof)", address: "Riederhof 37, 2993 XJ Barendrecht", city: "Barendrecht", website: "https://www.cbssmitshoek.nl/" },
  { name: "CBS Smitshoek (Brandsma-akker)", address: "Brandsma-akker 3, 2994 AA Barendrecht", city: "Barendrecht", website: "https://www.cbssmitshoek.nl/" },
  { name: "CBS Smitshoek (Kouwenhoven-akker)", address: "Kouwenhoven-akker 14, 2994 AS Barendrecht", city: "Barendrecht", website: "https://www.cbssmitshoek.nl/" },
  { name: "PCPO Bestuursbureau", address: "Achterom 70, 2991 CV Barendrecht", city: "Barendrecht", website: "https://www.werkenbijpcpobr.nl/" }
];

app.use(express.json());

// client map serveren
app.use(express.static(__dirname));



app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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


function parseAllowedChatSites() {
  const defaults = [
    "http://www.cbsdearkbarendrecht.nl/",
    "https://www.cbsdebongerd.nl/",
    "https://www.fonteinbolnes.nl/",
    "https://www.dehoeksteen-cbs.nl/",
    "https://cbsdeklimopridderkerk.nl/",
    "https://www.regenboogridderkerk.nl/",
    "https://www.cbsdevrijenburg.nl/",
    "http://www.cbsdewingerd-ridderkerk.nl/",
    "https://www.prinsterer.nl/",
    "https://www.kompasbarendrecht.nl/",
    "https://www.cbssmitshoek.nl/",
    "https://www.werkenbijpcpobr.nl/"
  ];

  const raw = process.env.ALLOWED_CHAT_SITES || "";
  if (!raw.trim()) return defaults;

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAndValidateHttpUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function stripHtmlToText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWebsiteSnippet(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "PCPO-Chatbot/1.0" }
    });

    if (!response.ok) {
      return { url, text: "", error: `HTTP ${response.status}` };
    }

    const html = await response.text();
    const text = stripHtmlToText(html).slice(0, 4000);
    return { url, text, error: "" };
  } catch (error) {
    return { url, text: "", error: error.message || "onbekende fout" };
  } finally {
    clearTimeout(timeout);
  }
}

function generateLocalAnswer(question, contextBlocks) {
  const q = String(question || "").toLowerCase().trim();
  const tokens = q
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9à-ÿ-]/gi, ""))
    .filter((token) => token.length >= 3);

  const schools = SCHOOL_DIRECTORY.map((school) => {
    const haystack = `${school.name} ${school.address} ${school.city} ${school.website}`.toLowerCase();
    let score = 0;

    if (q && haystack.includes(q)) score += 6;
    tokens.forEach((token) => {
      if (haystack.includes(token)) score += 1;
    });

    return { school, score };
  });

  const rankedSchools = schools
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.school);

  const topSchools = (rankedSchools.length > 0 ? rankedSchools : SCHOOL_DIRECTORY).slice(0, 3);

  const wantsAddress = ["waar", "adres", "locatie", "vestiging"].some((term) => q.includes(term));
  const wantsWebsite = ["site", "website", "web", "link"].some((term) => q.includes(term));

  if (topSchools.length === 0) {
    return "Ik kon op basis van de beschikbare schoolinformatie geen concreet antwoord vinden.";
  }

  if (topSchools.length === 1 && (wantsAddress || wantsWebsite)) {
    const school = topSchools[0];
    if (wantsAddress && wantsWebsite) {
      return `${school.name} zit op ${school.address} (${school.city}) en de website is ${school.website}.`;
    }
    if (wantsAddress) {
      return `${school.name} zit op ${school.address} (${school.city}).`;
    }
    return `De website van ${school.name} is ${school.website}.`;
  }

  return [
    "Ik kan nu geen live AI-antwoord genereren, maar dit is de best passende schoolinformatie:",
    ...topSchools.map((school) => `${school.name} | ${school.address} (${school.city}) | ${school.website}`)
  ].join("\n- ");
}

async function generateAiAnswer({ question, contextBlocks }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return generateLocalAnswer(question, contextBlocks);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const contextText = contextBlocks
    .map((block, index) => `Bron ${index + 1}: ${block.url}\n${block.text}`)
    .join("\n\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Je bent een behulpzame school-assistent. Antwoord alleen met informatie uit de meegegeven bronnen. Als iets niet in de bronnen staat, zeg dat duidelijk."
        },
        {
          role: "user",
          content: `Vraag: ${question}\n\nBronnen:\n${contextText}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();

    if (response.status === 429) {
      return generateLocalAnswer(question, contextBlocks);
    }

    throw new Error(`AI request mislukt (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
}

async function handleChatRequest(req, res) {
  const question = String(req.body?.question || "").trim();
  const requestedSources = Array.isArray(req.body?.sources) ? req.body.sources : [];

  if (!question) {
    return res.status(400).json({ error: "Vraag ontbreekt." });
  }

  const allowedSites = parseAllowedChatSites();

  const normalizedSources = requestedSources
    .map(normalizeAndValidateHttpUrl)
    .filter(Boolean)
    .slice(0, 8);

  const sourcesToUse =
    allowedSites.length > 0
      ? normalizedSources.filter((source) => allowedSites.some((allowed) => source.startsWith(allowed)))
      : normalizedSources;

  if (sourcesToUse.length === 0) {
    return res.status(400).json({
      error:
        "Geen geldige bronnen meegegeven. Stuur bronnen mee of configureer ALLOWED_CHAT_SITES op de server."
    });
  }

  const fetched = await Promise.all(sourcesToUse.map((url) => fetchWebsiteSnippet(url)));
  const usableContext = fetched.filter((entry) => entry.text);

  const staticContext = SCHOOL_DIRECTORY
    .filter((school) => sourcesToUse.some((source) => school.website.startsWith(source) || source.startsWith(school.website)))
    .map((school) => ({
      url: school.website,
      text: `${school.name} | ${school.address} | ${school.city} | Website: ${school.website}`
    }));

  const combinedContext = [...usableContext, ...staticContext];

  if (combinedContext.length === 0) {
    return res.status(502).json({
      error: "Kon geen bruikbare website- of schoolinformatie ophalen.",
      fetchErrors: fetched.filter((entry) => entry.error)
    });
  }

  try {
    const answer = await generateAiAnswer({ question, contextBlocks: combinedContext });
    return res.status(200).json({
      ok: true,
      answer: answer || "Ik kon geen duidelijk antwoord vormen uit de beschikbare bronnen.",
      usedSources: combinedContext.map((entry) => entry.url),
      fetchErrors: fetched.filter((entry) => entry.error)
    });
  } catch (error) {
    return res.status(500).json({ error: `AI-chat mislukt: ${error.message}` });
  }
}

app.post("/api/chat", handleChatRequest);
app.post("/chat", handleChatRequest);


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