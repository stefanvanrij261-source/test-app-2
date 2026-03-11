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

const CHAT_FETCH_CACHE = new Map();
const CHAT_CACHE_TTL_MS = 5 * 60 * 1000;

const INTENT_TERMS = {
  openingstijden: ["opening", "openingstijd", "uren", "wanneer open", "wanneer dicht"],
  parkeren: ["parkeren", "parkeer", "parkeerplaats", "auto", "bereikbaarheid"],
  contact: ["contact", "mail", "email", "telefoon", "bellen"],
  adres: ["adres", "waar", "locatie", "route", "vestiging"],
  inschrijven: ["inschrijven", "inschrijving", "aanmelden", "toelating"]
};

function normalizeAndValidateHttpUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function tokenize(value) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3);
}

function stripHtmlToText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 40)
    .slice(0, 400);
}

function buildSchoolFacts(school) {
  return [
    `${school.name} zit op ${school.address} in ${school.city}.`,
    `Website van ${school.name}: ${school.website}.`
  ];
}

function detectQuestionIntent(question) {
  const q = normalizeText(question);
  const intents = [];
  Object.entries(INTENT_TERMS).forEach(([intent, terms]) => {
    if (terms.some((term) => q.includes(term))) intents.push(intent);
  });
  return intents;
}

function pickRelevantSchools(question, sourcesToUse) {
  const q = normalizeText(question);
  const tokens = tokenize(question);

  const fromSource = SCHOOL_DIRECTORY.filter((school) => {
    const website = normalizeAndValidateHttpUrl(school.website);
    return website && sourcesToUse.some((src) => website.startsWith(src) || src.startsWith(website));
  });

  const scored = fromSource.map((school) => {
    const haystack = normalizeText(`${school.name} ${school.address} ${school.city} ${school.website}`);
    let score = 0;

    if (q && haystack.includes(q)) score += 5;
    tokens.forEach((token) => {
      if (haystack.includes(token)) score += 1;
    });

    return { school, score };
  });

  const ranked = scored.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score);
  if (ranked.length > 0) return ranked.map((entry) => entry.school).slice(0, 3);

  return fromSource.slice(0, 3);
}

async function fetchWebsiteSnippet(url) {
  const now = Date.now();
  const cached = CHAT_FETCH_CACHE.get(url);
  if (cached && now - cached.at < CHAT_CACHE_TTL_MS) return cached.value;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "PCPO-Chatbot/1.0" }
    });

    if (!response.ok) {
      const value = { url, text: "", sentences: [], error: `HTTP ${response.status}` };
      CHAT_FETCH_CACHE.set(url, { at: now, value });
      return value;
    }

    const html = await response.text();
    const text = stripHtmlToText(html).slice(0, 12000);
    const value = { url, text, sentences: splitIntoSentences(text), error: "" };
    CHAT_FETCH_CACHE.set(url, { at: now, value });
    return value;
  } catch (error) {
    const value = { url, text: "", sentences: [], error: error.message || "onbekende fout" };
    CHAT_FETCH_CACHE.set(url, { at: now, value });
    return value;
  } finally {
    clearTimeout(timeout);
  }
}

function scoreSentence(sentence, questionTokens, intentTerms) {
  const normalizedSentence = normalizeText(sentence);
  let score = 0;

  questionTokens.forEach((token) => {
    if (normalizedSentence.includes(token)) score += 2;
  });

  intentTerms.forEach((term) => {
    if (normalizedSentence.includes(term)) score += 3;
  });

  if (normalizedSentence.includes("contact") || normalizedSentence.includes("aanmelden")) score += 0.5;

  return score;
}

function buildRealtimeAnswer(question, snippets, schools) {
  const questionTokens = tokenize(question);
  const intents = detectQuestionIntent(question);
  const intentTerms = intents.flatMap((intent) => INTENT_TERMS[intent] || []).map(normalizeText);

  const candidates = [];

  snippets.forEach((snippet) => {
    snippet.sentences.forEach((sentence) => {
      const score = scoreSentence(sentence, questionTokens, intentTerms);
      if (score > 0) {
        candidates.push({ sentence, score, source: snippet.url });
      }
    });
  });

  schools.forEach((school) => {
    buildSchoolFacts(school).forEach((fact) => {
      const score = scoreSentence(fact, questionTokens, intentTerms) + 2;
      candidates.push({ sentence: fact, score, source: school.website });
    });
  });

  if (candidates.length === 0) {
    if (schools.length > 0) {
      const school = schools[0];
      return `Ik heb nog geen direct antwoord gevonden op je vraag. Wel weet ik dat ${school.name} zit op ${school.address} (${school.city}). Website: ${school.website}.`;
    }

    return "Ik kon geen passend antwoord vinden in de geselecteerde websites. Stel je vraag specifieker met een schoolnaam of onderwerp zoals openingstijden, parkeren of contact.";
  }

  const best = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .filter((entry, index, arr) => arr.findIndex((x) => x.sentence === entry.sentence) === index);

  const lines = best.map((entry) => `- ${entry.sentence}`);
  const usedSources = [...new Set(best.map((entry) => entry.source))].slice(0, 3);

  return `${lines.join("\n")}\n\nBronnen: ${usedSources.join(", ")}`;
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
    .slice(0, 12);

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

  const relevantSchools = pickRelevantSchools(question, sourcesToUse);
  const prioritizedSources = [
    ...relevantSchools.map((school) => normalizeAndValidateHttpUrl(school.website)).filter(Boolean),
    ...sourcesToUse
  ];

  const uniqueSources = [...new Set(prioritizedSources)].slice(0, 6);
  const fetched = await Promise.all(uniqueSources.map((url) => fetchWebsiteSnippet(url)));
  const usableSnippets = fetched.filter((entry) => entry.text);

  const answer = buildRealtimeAnswer(question, usableSnippets, relevantSchools);

  return res.status(200).json({
    ok: true,
    answer,
    usedSources: uniqueSources,
    fetchErrors: fetched.filter((entry) => entry.error)
  });
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