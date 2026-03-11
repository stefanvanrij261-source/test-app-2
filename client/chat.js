document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const chatQuickActions = document.getElementById("chatQuickActions");
  const chatToggle = document.getElementById("chatToggle");
  const chatClose = document.getElementById("chatClose");
  const chatbotPanel = document.getElementById("chatbotPanel");
  const chatForm = document.getElementById("chatForm");
  const chatReset = document.getElementById("chatReset");

  if (!chatMessages) return;

  const CHAT_STORAGE_KEY = "pcpo-chat-history-v4";
  let pendingSchoolContext = null;

  const KNOWLEDGE_BASE = [
    {
      id: "org-name",
      keywords: ["wat is pcpo", "naam organisatie", "organisatie naam", "stichting"],
      answer:
        "De organisatie heet Stichting PCPO Barendrecht & Ridderkerk. Het is protestants-christelijk primair onderwijs."
    },
    {
      id: "org-size",
      keywords: ["hoeveel scholen", "aantal scholen", "hoeveel locaties", "hoeveel leerlingen", "hoeveel medewerkers"],
      answer:
        "PCPO heeft 11 basisscholen op 14 locaties, met ongeveer 4200 leerlingen en circa 450 medewerkers."
    },
    {
      id: "board-office",
      keywords: ["bestuurskantoor", "hoofdkantoor", "achterom 70", "postbus 217", "info@pcpobr.nl", "0180-620533"],
      answer:
        "Bestuurskantoor PCPO: Achterom 70, 2991 CV Barendrecht. Postadres: Postbus 217, 2990 AE Barendrecht. Telefoon: 0180-620533. E-mail: info@pcpobr.nl."
    },
    {
      id: "contact",
      keywords: ["hoe neem ik contact op", "contact opnemen", "contact", "bereikbaar", "bereikbaarheid"],
      answer:
        "Je kunt contact opnemen via e-mail info@pcpobr.nl of telefonisch via 0180-620533. Adres bestuurskantoor: Achterom 70, 2991 CV Barendrecht."
    },
    {
      id: "org-address",
      keywords: ["wat is jullie adres", "jullie adres", "adres pcpo", "waar zitten jullie", "achterom"],
      answer:
        "Het adres van het PCPO-bestuurskantoor is Achterom 70, 2991 CV Barendrecht. Postadres: Postbus 217, 2990 AE Barendrecht."
    },
    {
      id: "org-phone",
      keywords: ["wat is jullie telefoonnummer", "jullie telefoonnummer", "pcpo telefoon", "telefoonnummer", "0180 620533", "0180-620533"],
      answer:
        "Je kunt ons telefonisch bereiken via 0180-620533."
    },
    {
      id: "org-email",
      keywords: ["wat is jullie e mail", "wat is jullie email", "wat is jullie e mailadres", "wat is jullie emailadres", "jullie e mail", "jullie email", "e-mailadres", "emailadres", "mailadres", "info@pcpobr.nl"],
      answer:
        "Je kunt ons mailen via info@pcpobr.nl."
    },
    {
      id: "org-hours",
      keywords: ["openingstijden", "opening tijden", "wanneer open", "wanneer bereikbaar", "kantoortijden"],
      answer:
        "De algemene openingstijden verschillen per school of afdeling. Voor het bestuurskantoor kun je het beste even bellen via 0180-620533 of mailen naar info@pcpobr.nl voor actuele bereikbaarheid."
    },
    {
      id: "history",
      keywords: ["historie", "geschiedenis", "fusie", "2005", "2019"],
      answer:
        "Historie: in 2005 ontstond PCPO uit een fusie van PC-schoolverenigingen in Barendrecht, Ridderkerk en Bolnes. In 2019 is de organisatie een stichting geworden (voorheen vereniging)."
    },
    {
      id: "mission",
      keywords: ["missie", "identiteit", "christelijk onderwijs", "talentontwikkeling", "persoonlijke ontwikkeling"],
      answer:
        "PCPO staat voor christelijk onderwijs, persoonlijke ontwikkeling, talentontwikkeling en samenwerking tussen school, ouders en samenleving."
    },
    {
      id: "christian-identity",
      keywords: ["christelijke identiteit", "bijbel", "bidden", "kerst", "pasen", "christelijke waarden"],
      answer:
        "Binnen PCPO-scholen worden bijbelverhalen verteld, er wordt gebeden, christelijke liederen gezongen en feesten zoals Kerst en Pasen gevierd."
    },
    {
      id: "koersplan",
      keywords: ["koersplan", "geloven in samen groeien", "2023", "2027", "pijlers"],
      answer:
        "Het strategisch plan heet ‘Geloven in samen groeien’ (2023-2027), met pijlers: ontwikkeling van kinderen, ontwikkeling van medewerkers, organisatieontwikkeling en brede persoonsvorming."
    },
    {
      id: "governance",
      keywords: ["raad van toezicht", "bestuur", "directeur-bestuurder", "gmr", "medezeggenschapsraad"],
      answer:
        "De governance bestaat uit een Raad van Toezicht, een directeur-bestuurder en een GMR (6 ouders en 6 personeelsleden) die advies en instemming geeft op o.a. beleid en begroting."
    },
    {
      id: "childcare",
      keywords: ["kinderopvang", "skr", "kibeo", "eiland marleyne", "ikc"],
      answer:
        "PCPO werkt samen met kinderopvangpartners: in Ridderkerk o.a. SKR, en in Barendrecht o.a. Kibeo en Eiland Marleyne. Veel scholen werken als IKC met onderwijs, opvang en wijkpartners."
    },
    {
      id: "passend-onderwijs",
      keywords: ["passend onderwijs", "riba", "extra ondersteuning", "albrandswaard"],
      answer:
        "Voor passend onderwijs werkt PCPO samen in samenwerkingsverband RiBA (Ridderkerk, Barendrecht, Albrandswaard) voor leerlingen met extra ondersteuningsbehoeften."
    },
    {
      id: "privacy",
      keywords: ["privacy", "avg", "gegevensbescherming", "privacy@pcpobr.nl", "beeldmateriaal"],
      answer:
        "Er is een stichtingbreed privacybeleid (AVG), met o.a. toestemmingen via de ouderapp en een Functionaris Gegevensbescherming. Privacycontact: privacy@pcpobr.nl."
    },
    {
      id: "social-schools",
      keywords: ["social schools", "oudercommunicatie", "ziekmelden", "agenda", "toestemmingen", "foto's", "fotos"],
      answer:
        "Oudercommunicatie verloopt via de Social Schools app voor berichten, ziekmeldingen, foto’s, agenda en toestemmingen."
    },
    {
      id: "inschrijven",
      keywords: ["inschrijven", "inschrijving", "toelating", "3 jaar", "4 jaar", "aanmelden"],
      answer:
        "Kinderen kunnen vaak vanaf 3 jaar worden ingeschreven en starten op de basisschool vanaf 4 jaar. Toelating hangt af van plaats, beschikbare ruimte en onderwijsbehoeften volgens het officiële toelatingsbeleid."
    },
    {
      id: "doorstroom-vo",
      keywords: ["groep 8", "schooladvies", "doorstroomtoets", "middelbare school", "vo"],
      answer:
        "In groep 8 krijgen leerlingen een schooladvies en maken zij de doorstroomtoets (februari). Aanmelding voor VO gaat via de centrale aanmeldweek. Het advies is gebaseerd op resultaten, LVS en leerkrachtbeoordeling."
    },
    {
      id: "schools-overview",
      keywords: ["waar zitten ze", "overzicht scholen", "alle scholen", "barendrecht", "ridderkerk scholen"],
      answer:
        "Barendrecht: CBS De Ark, CBS De Hoeksteen, CBS Het Kompas, CBS Groen van Prinsterer, CBS De Vrijenburg, CBS Smitshoek. Ridderkerk: CBS De Fontein, CBS De Regenboog, CBS De Klimop, CBS De Wingerd, CBS De Bongerd."
    },
    {
      id: "subsidies",
      keywords: ["subsidies", "basisvaardigheden", "ontwikkelkracht", "welke scholen subsidie"],
      answer:
        "Voorbeelden van subsidies zijn verbetering basisvaardigheden en Ontwikkelkracht. Scholen die subsidie ontvingen: Het Kompas, De Regenboog, De Klimop en De Bongerd."
    },
    {
      id: "onderwijsprogramma",
      keywords: ["lesprogramma", "onderwijsprogramma", "vakken", "taal", "rekenen", "burgerschap", "digitale vaardigheden"],
      answer:
        "Het programma bevat basisvakken zoals taal, rekenen, lezen en spelling, plus wereldoriëntatie, kunst & cultuur, muziek, bewegingsonderwijs, burgerschap en digitale vaardigheden."
    },
    {
      id: "veiligheid",
      keywords: ["veiligheid", "anti-pest", "vertrouwenspersonen", "meldprocedures", "veiligheidsplan"],
      answer:
        "PCPO-scholen werken met anti-pestbeleid, vertrouwenspersonen, meldprocedures en een veiligheidsplan."
    }
  ];

  const SCHOOL_KNOWLEDGE = [
    {
      name: "cbs de ark",
      aliases: ["de ark", "ark"],
      address: "Klipper 108-109, 2991 KM Barendrecht",
      phone: "0180-616998",
      details: "veilige leeromgeving, aandacht voor talentontwikkeling en samenwerking met ouders"
    },
    {
      name: "cbs de hoeksteen",
      aliases: ["de hoeksteen", "hoeksteen"],
      address: "Kruidentuin 6a, 2991 RK Barendrecht",
      phone: "0180-613938",
      details: "christelijke basisschool met pedagogisch klimaat en aandacht voor persoonlijke ontwikkeling"
    },
    {
      name: "cbs het kompas",
      aliases: ["het kompas", "kompas"],
      address: "Hoefslag 20, 2992 VH Barendrecht",
      phone: "0180-615225",
      details: "visie: ‘Elk kind maakt een reis van groei en ontwikkeling’"
    },
    {
      name: "cbs groen van prinsterer",
      aliases: ["groen van prinsterer", "prinsterer"],
      address: "Stellingmolen 10, 2992 DN Barendrecht",
      phone: "bekend via schoolsite",
      details: "ongeveer 500 leerlingen, twee locaties en plusgroep voor hoogbegaafde leerlingen (De Komeet)"
    },
    {
      name: "cbs de vrijenburg",
      aliases: ["de vrijenburg", "vrijenburg"],
      address: "Vrijenburglaan 61, 2994 CD Barendrecht",
      phone: "bekend via schoolsite",
      details: "modern onderwijs, samenwerking met ouders en brede ontwikkeling"
    },
    {
      name: "cbs smitshoek",
      aliases: ["smitshoek"],
      address: "locaties: Riederhof, Brandsma-akker en Kouwenhoven-akker (Barendrecht)",
      phone: "bekend via schoolsite",
      details: "grote basisschool met meerdere gebouwen en veel groepen"
    },
    {
      name: "cbs de fontein",
      aliases: ["de fontein", "fontein"],
      address: "Scheldeplein 4, 2987 EL Ridderkerk",
      phone: "bekend via schoolsite",
      details: "talentontwikkeling, persoonlijk onderwijs en veilige schoolcultuur"
    },
    {
      name: "cbs de regenboog",
      aliases: ["de regenboog", "regenboog"],
      address: "Reijerweg 60, 2983 AT Ridderkerk",
      phone: "bekend via schoolsite",
      details: "ongeveer 403 leerlingen, visie ‘Voor een kleurrijke groei’, focus op diversiteit en talentontwikkeling"
    },
    {
      name: "cbs de klimop",
      aliases: ["de klimop", "klimop"],
      address: "Meester Treubstraat 3, 2982 VN Ridderkerk",
      phone: "bekend via schoolsite",
      details: "IKC-samenwerking en sterke ouderbetrokkenheid"
    },
    {
      name: "cbs de wingerd",
      aliases: ["de wingerd", "wingerd"],
      address: "Da Costalaan 3, 2985 BC Ridderkerk",
      phone: "bekend via schoolsite",
      details: "persoonlijke aandacht en modern onderwijs"
    },
    {
      name: "cbs de bongerd",
      aliases: ["de bongerd", "bongerd"],
      address: "Patrijs 28-29, 2986 CA Ridderkerk",
      phone: "0180-425857",
      details:
        "schooltijden 08:30–14:00 (dagelijks), Engels onderwijs in alle groepen en native speaker Engels"
    }
  ];

  function getLocaleText(key) {
    if (typeof window.getLocaleText === "function") return window.getLocaleText(key);
    return "";
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function saveChatHistory() {
    const history = [...chatMessages.querySelectorAll("p.user, p.bot")].map((item) => ({
      sender: item.classList.contains("user") ? "user" : "bot",
      text: item.textContent || ""
    }));

    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({ language: window.getCurrentLanguage?.() || "nl", history })
    );
  }

  function appendMessage(text, sender, skipStore = false) {
    const bubble = document.createElement("p");
    bubble.className = sender;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (!skipStore && (sender === "user" || sender === "bot")) saveChatHistory();
  }

  function updateChatLanguageUI() {
    if (chatInput) chatInput.placeholder = getLocaleText("chatInput");

    if (!chatQuickActions) return;
    chatQuickActions.querySelectorAll("button[data-question-key]").forEach((button) => {
      const key = button.getAttribute("data-question-key");
      if (!key) return;
      const qKey = key.replace("qa", "q");
      button.dataset.question = getLocaleText(qKey);
    });
  }

  function loadChatHistory() {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);

    if (!raw) {
      appendMessage(getLocaleText("chatWelcome"), "bot", true);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const history = Array.isArray(parsed?.history) ? parsed.history : [];
      if (history.length === 0) {
        appendMessage(getLocaleText("chatWelcome"), "bot", true);
        return;
      }

      history.forEach((entry) => {
        if (!entry || !entry.text || (entry.sender !== "user" && entry.sender !== "bot")) return;
        appendMessage(entry.text, entry.sender, true);
      });
    } catch {
      appendMessage(getLocaleText("chatWelcome"), "bot", true);
    }
  }

  function matchSchool(question) {
    const normalized = normalizeText(question);
    const questionTokens = normalized.split(" ").filter(Boolean);

    let bestMatch = null;
    let bestScore = 0;

    SCHOOL_KNOWLEDGE.forEach((school) => {
      const names = [school.name, ...school.aliases].map(normalizeText);

      names.forEach((name) => {
        if (!name) return;
        if (normalized.includes(name)) {
          const phraseScore = 10 + name.split(" ").length;
          if (phraseScore > bestScore) {
            bestScore = phraseScore;
            bestMatch = school;
          }
          return;
        }

        const nameTokens = name.split(" ").filter((token) => token.length >= 2);
        const tokenHits = nameTokens.filter((token) => questionTokens.includes(token)).length;

        if (tokenHits >= Math.max(2, nameTokens.length - 1)) {
          const tokenScore = tokenHits;
          if (tokenScore > bestScore) {
            bestScore = tokenScore;
            bestMatch = school;
          }
        }
      });
    });

    return bestMatch;
  }

  function detectSchoolTopic(question) {
    const normalized = normalizeText(question);

    if (normalized.includes("email") || normalized.includes("e mail") || normalized.includes("mail")) return "email";
    if (normalized.includes("adres") || normalized.includes("waar") || normalized.includes("locatie")) return "adres";
    if (normalized.includes("telefoon") || normalized.includes("nummer") || normalized.includes("bellen")) return "telefoon";
    if (normalized.includes("schooltijd") || normalized.includes("opening") || normalized.includes("uren")) return "schooltijden";
    if (normalized.includes("inschrijven") || normalized.includes("aanmelden") || normalized.includes("toelating")) return "inschrijven";

    if (normalized.includes("kenmerk") || normalized.includes("info")) return "kenmerken";

    return "";
  }

  function buildSchoolOptionsPrompt(school) {
    return `Wat wil je weten over ${school.name}?
- Adres
- Telefoonnummer
- Openingstijden / schooltijden
- Inschrijven
- E-mailadres
- Kenmerken`;
  }

  function buildSchoolReply(topic, school) {
    if (topic === "email") {
      return `Het e-mailadres van ${school.name} is niet opgenomen in deze chatbotdata. Gebruik de schoolwebsite of neem contact op via info@pcpobr.nl.`;
    }

    if (topic === "adres") {
      return `${school.name} is gevestigd op ${school.address}.`;
    }

    if (topic === "telefoon") {
      return `${school.name} is telefonisch bereikbaar via ${school.phone}.`;
    }

    if (topic === "schooltijden") {
      if (school.name.includes("bongerd")) {
        return `${school.name} heeft schooltijden van 08:30 tot 14:00 (dagelijks).`;
      }
      return `De schooltijden verschillen per school. Voor ${school.name} kun je de actuele tijden het beste opvragen via de schoolsite of het secretariaat.`;
    }

    if (topic === "inschrijven") {
      return `${school.name}: inschrijven kan meestal vanaf 3 jaar en starten kan vanaf 4 jaar. Toelating hangt af van plaats, beschikbare ruimte en onderwijsbehoeften. Neem voor ${school.name} direct contact op met de school.`;
    }

    if (topic === "kenmerken") {
      return `${school.name}: ${school.details}.`;
    }

    return buildSchoolOptionsPrompt(school);
  }

  function scoreKnowledgeEntry(question, entry) {
    const normalizedQuestion = normalizeText(question);
    return entry.keywords.reduce((score, keyword) => {
      const nKeyword = normalizeText(keyword);
      if (!nKeyword) return score;
      if (normalizedQuestion === nKeyword) return score + 5;
      if (normalizedQuestion.includes(nKeyword)) return score + 3;
      return score;
    }, 0);
  }

  function getKnowledgeReply(question) {
    const scored = KNOWLEDGE_BASE.map((entry) => ({ entry, score: scoreKnowledgeEntry(question, entry) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) return "";
    return scored[0].entry.answer;
  }

  function getGeneralIntentReply(question) {
    const normalized = normalizeText(question);

    if (normalized === "hoe neem ik contact op") {
      return "Je kunt contact opnemen via e-mail info@pcpobr.nl of telefonisch via 0180-620533.";
    }

    if (normalized === "wat is jullie telefoonnummer" || normalized.includes("pcpo telefoon") || normalized.includes("telefoonnummer") || normalized.includes("telefoon") || normalized.includes("bellen")) {
      return "Je kunt ons telefonisch bereiken via 0180-620533.";
    }

    if (normalized === "wat is jullie e mailadres" || normalized === "wat is jullie emailadres" || normalized.includes("e mailadres") || normalized.includes("emailadres") || normalized.includes("e mail") || normalized.includes("email")) {
      return "Je kunt ons mailen via info@pcpobr.nl.";
    }

    if (normalized === "wat is jullie adres" || normalized.includes("jullie adres") || normalized.includes("adres")) {
      return "Het adres van het PCPO-bestuurskantoor is Achterom 70, 2991 CV Barendrecht. Postadres: Postbus 217, 2990 AE Barendrecht.";
    }

    if (normalized.includes("openingstijden") || normalized.includes("opening tijden") || normalized.includes("kantoortijden")) {
      return "De openingstijden verschillen per school of afdeling. Voor actuele bereikbaarheid kun je bellen naar 0180-620533 of mailen naar info@pcpobr.nl.";
    }

    if (normalized.includes("contact") || normalized.includes("bereikbaar")) {
      return "Je kunt contact opnemen via e-mail info@pcpobr.nl of telefonisch via 0180-620533.";
    }

    return "";
  }

  function getBotReply(question) {
    const normalized = normalizeText(question);
    const school = matchSchool(question);

    if (pendingSchoolContext && !school) {
      const topicFromSelection = detectSchoolTopic(question);
      if (topicFromSelection) {
        const schoolReply = buildSchoolReply(topicFromSelection, pendingSchoolContext);
        pendingSchoolContext = null;
        return schoolReply;
      }

      return `${buildSchoolOptionsPrompt(pendingSchoolContext)}\nTyp gewoon het onderwerp dat je wilt weten.`;
    }

    if (school) {
      const topic = detectSchoolTopic(question);
      if (topic) {
        pendingSchoolContext = null;
        return buildSchoolReply(topic, school);
      }

      pendingSchoolContext = school;
      return buildSchoolOptionsPrompt(school);
    }

    const generalIntentReply = getGeneralIntentReply(question);
    if (generalIntentReply) {
      pendingSchoolContext = null;
      return generalIntentReply;
    }

    const knowledgeReply = getKnowledgeReply(question);
    if (knowledgeReply) {
      pendingSchoolContext = null;
      return knowledgeReply;
    }

    return "Ik heb daar nog geen exact antwoord op. Je kunt je vraag specifieker maken (bijvoorbeeld: schoolnaam + onderwerp zoals adres, schooltijden, inschrijven, privacy of passend onderwijs) of mailen naar info@pcpobr.nl.";
  }

  function createTypingIndicator() {
    const typing = document.createElement("p");
    typing.className = "bot typing";
    typing.textContent = getLocaleText("chatTyping") || "Chatbot typt...";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  function handleQuestion(question) {
    appendMessage(question, "user");
    const typing = createTypingIndicator();
    setTimeout(() => {
      typing.remove();
      appendMessage(getBotReply(question), "bot");
    }, 320);
  }
/*k*/
  function setChatOpenState(open) {
    if (!chatbotPanel || !chatToggle) return;
    chatbotPanel.hidden = !open;
    chatToggle.setAttribute("aria-expanded", String(open));
    if (open && chatInput) chatInput.focus();
  }

  if (chatToggle && chatbotPanel) {
    chatToggle.addEventListener("click", () => setChatOpenState(chatbotPanel.hidden));
  }

  if (chatClose) chatClose.addEventListener("click", () => setChatOpenState(false));

  if (chatForm && chatInput) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;
      chatInput.value = "";
      handleQuestion(question);
    });
  }

  if (chatQuickActions) {
    chatQuickActions.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const question = target.dataset.question;
      if (!question) return;
      handleQuestion(question);
    });
  }

  if (chatReset) {
    chatReset.addEventListener("click", () => {
      chatMessages.innerHTML = "";
      localStorage.removeItem(CHAT_STORAGE_KEY);
      pendingSchoolContext = null;
      appendMessage(getLocaleText("chatResetDone") || "Chat is opnieuw gestart. Stel gerust je vraag.", "bot");
    });
  }

  document.addEventListener("languageChanged", () => {
    updateChatLanguageUI();
    saveChatHistory();
  });

  updateChatLanguageUI();
  loadChatHistory();
});