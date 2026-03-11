document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  if (toggleButton && sideMenu) {
    toggleButton.addEventListener("click", () => {
      sideMenu.classList.toggle("open");
      toggleButton.classList.toggle("open");
    });
  }

  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");

  function showSlides() {
    slides.forEach((slide) => {
      slide.style.display = "none";
    });
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000);
  }

  if (slides.length > 0) showSlides();

  const videoTrigger = document.getElementById("videoCubeTrigger");
  const videoModal = document.getElementById("videoModal");
  const videoFrame = document.getElementById("videoModalFrame");
  const videoClose = document.getElementById("videoModalClose");
  const videoEmbedUrl = "https://www.youtube.com/embed/Y0fItGyUNPs?autoplay=1&rel=0";

  function openVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoFrame.src = videoEmbedUrl;
    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeVideoModal() {
    if (!videoModal || !videoFrame) return;
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    videoFrame.src = "";
    document.body.style.overflow = "";
  }

  if (videoTrigger && videoModal && videoFrame && videoClose) {
    videoTrigger.addEventListener("click", openVideoModal);
    videoClose.addEventListener("click", closeVideoModal);
    videoModal.addEventListener("click", (event) => {
      if (event.target === videoModal) closeVideoModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && videoModal.classList.contains("open")) closeVideoModal();
    });
  }

  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return "phone";
    if (width < 1024) return "tablet";
    return "laptop";
  }

  document.body.setAttribute("data-device", getDeviceType());

  const baseNl = {
    pageTitle: "Contact",
    translateLabel: "Vertaal de hele pagina:",
    navSchoolInfo: "Schoolinformatie",
    navSchoolFit: "Welke school past bij jouw kind?",
    navSchools: "Onze scholen",
    navContact: "Contact",
    navHome: "Home",
    emailTitle: "E-mail",
    emailText: "Mail ons je vragen",
    phoneTitle: "Telefoon",
    phoneText: "Bel ons",
    addressTitle: "Adres",
    formTitle: "Contactformulier",
    labelName: "Naam",
    labelEmail: "E-mail",
    labelSubject: "Onderwerp",
    labelMessage: "Bericht",
    submit: "Verzenden",
    formSending: "Bericht wordt verzonden...",
    formSuccess: "Bedankt! Je bericht is succesvol verstuurd.",
    formError: "Verzenden is mislukt. Probeer het opnieuw.",
    chatTitle: "PCPO Chatbot",
    chatStatus: "Online • We reageren direct",
    chatInput: "Typ je vraag...",
    chatSend: "Verstuur",
    chatReset: "Chat legen",
    qaEmail: "E-mailadres",
    qaPhone: "Telefoon",
    qaAddress: "Adres",
    qaContact: "Contact opnemen",
    qEmail: "Wat is jullie e-mailadres?",
    qPhone: "Wat is jullie telefoonnummer?",
    qAddress: "Wat is jullie adres?",
    qContact: "Hoe neem ik contact op?",
    chatWelcome: "Hoi! Stel hier je vraag over contact, openingstijden of scholen.",
    chatTyping: "Chatbot typt...",
    chatFallback: "Dank je voor je vraag. Gebruik het contactformulier, dan reageren we zo snel mogelijk.",
    chatResetDone: "Chat is opnieuw gestart. Stel gerust je vraag.",
    aEmail: "Je kunt mailen naar pcpocontact@gmail.com. Gebruik ook gerust het contactformulier op deze pagina.",
    aPhone: "Je kunt ons bellen via 0180620533 tijdens schooluren.",
    aAddress: "Ons adres is Achterom 70, 2991 CV Barendrecht.",
    aHours: "Voor actuele openingstijden kun je het beste even bellen of mailen.",
    aSchools: "Voor vragen over scholen of inschrijving: stuur ons een bericht via het formulier.",
    aGreeting: "Hoi! Waar kan ik je mee helpen?"
  };

  const i18n = {
    nl: baseNl,
    en: {
      pageTitle: "Contact",
      translateLabel: "Translate the full page:",
      navSchoolInfo: "School information",
      navSchoolFit: "Which school fits your child?",
      navSchools: "Our schools",
      navContact: "Contact",
      navHome: "Home",
      emailTitle: "Email",
      emailText: "Send us your questions",
      phoneTitle: "Phone",
      phoneText: "Call us",
      addressTitle: "Address",
      formTitle: "Contact form",
      labelName: "Name",
      labelEmail: "Email",
      labelSubject: "Subject",
      labelMessage: "Message",
      submit: "Send",
      formSending: "Sending your message...",
      formSuccess: "Thanks! Your message has been sent.",
      formError: "Sending failed. Please try again.",
      chatTitle: "PCPO Chatbot",
      chatStatus: "Online • We reply quickly",
      chatInput: "Type your question...",
      chatSend: "Send",
      chatReset: "Clear chat",
      qaEmail: "Email",
      qaPhone: "Phone",
      qaAddress: "Address",
      qaContact: "Contact us",
      qEmail: "What is your email address?",
      qPhone: "What is your phone number?",
      qAddress: "What is your address?",
      qContact: "How can I contact you?",
      chatWelcome: "Hi! Ask your question about contact, opening hours, or schools.",
      chatTyping: "Chatbot is typing...",
      chatFallback: "Thanks for your question. Use the contact form and we will reply as soon as possible.",
      chatResetDone: "Chat has been reset. Feel free to ask your question.",
      aEmail: "You can email us at pcpocontact@gmail.com. You can also use the contact form on this page.",
      aPhone: "You can call us at 0180620533 during school hours.",
      aAddress: "Our address is Achterom 70, 2991 CV Barendrecht.",
      aHours: "For opening hours, please call or email us.",
      aSchools: "For school or registration questions, send a message via the form.",
      aGreeting: "Hi! How can I help you?"
    },
    de: {
      pageTitle: "Kontakt",
      translateLabel: "Gesamte Seite übersetzen:",
      navSchoolInfo: "Schulinformationen",
      navSchoolFit: "Welche Schule passt zu Ihrem Kind?",
      navSchools: "Unsere Schulen",
      navContact: "Kontakt",
      navHome: "Startseite",
      emailTitle: "E-Mail",
      emailText: "Senden Sie uns Ihre Fragen",
      phoneTitle: "Telefon",
      phoneText: "Rufen Sie uns an",
      addressTitle: "Adresse",
      formTitle: "Kontaktformular",
      labelName: "Name",
      labelEmail: "E-Mail",
      labelSubject: "Betreff",
      labelMessage: "Nachricht",
      submit: "Senden",
      formSending: "Nachricht wird gesendet...",
      formSuccess: "Danke! Ihre Nachricht wurde gesendet.",
      formError: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
      chatTitle: "PCPO Chatbot",
      chatStatus: "Online • Wir antworten schnell",
      chatInput: "Schreiben Sie Ihre Frage...",
      chatSend: "Senden",
      chatReset: "Chat leeren",
      qaEmail: "E-Mail-Adresse",
      qaPhone: "Telefon",
      qaAddress: "Adresse",
      qaContact: "Kontakt aufnehmen",
      qEmail: "Wie lautet Ihre E-Mail-Adresse?",
      qPhone: "Wie lautet Ihre Telefonnummer?",
      qAddress: "Wie lautet Ihre Adresse?",
      qContact: "Wie kann ich Kontakt aufnehmen?",
      chatWelcome: "Hallo! Stellen Sie hier Ihre Frage zu Kontakt, Öffnungszeiten oder Schulen.",
      chatTyping: "Chatbot tippt...",
      chatFallback: "Danke für Ihre Frage. Nutzen Sie bitte das Kontaktformular, wir antworten so schnell wie möglich.",
      chatResetDone: "Der Chat wurde zurückgesetzt. Stellen Sie gern Ihre Frage.",
      aEmail: "Sie können uns unter pcpocontact@gmail.com schreiben. Sie können auch das Kontaktformular auf dieser Seite nutzen.",
      aPhone: "Sie erreichen uns unter 0180620533 während der Schulzeiten.",
      aAddress: "Unsere Adresse ist Achterom 70, 2991 CV Barendrecht.",
      aHours: "Für aktuelle Öffnungszeiten rufen Sie uns bitte an oder schreiben Sie uns.",
      aSchools: "Bei Fragen zu Schulen oder Anmeldung senden Sie eine Nachricht über das Formular.",
      aGreeting: "Hallo! Wie kann ich Ihnen helfen?"
    },
    fr: {
      pageTitle: "Contact",
      translateLabel: "Traduire toute la page :",
      navSchoolInfo: "Informations scolaires",
      navSchoolFit: "Quelle école convient à votre enfant ?",
      navSchools: "Nos écoles",
      navContact: "Contact",
      navHome: "Accueil",
      emailTitle: "E-mail",
      emailText: "Envoyez-nous vos questions",
      phoneTitle: "Téléphone",
      phoneText: "Appelez-nous",
      addressTitle: "Adresse",
      formTitle: "Formulaire de contact",
      labelName: "Nom",
      labelEmail: "E-mail",
      labelSubject: "Sujet",
      labelMessage: "Message",
      submit: "Envoyer",
      formSending: "Envoi du message...",
      formSuccess: "Merci ! Votre message a été envoyé.",
      formError: "Échec de l’envoi. Veuillez réessayer.",
      chatTitle: "PCPO Chatbot",
      chatStatus: "En ligne • Nous répondons rapidement",
      chatInput: "Tapez votre question...",
      chatSend: "Envoyer",
      chatReset: "Vider le chat",
      qaEmail: "Adresse e-mail",
      qaPhone: "Téléphone",
      qaAddress: "Adresse",
      qaContact: "Nous contacter",
      qEmail: "Quelle est votre adresse e-mail ?",
      qPhone: "Quel est votre numéro de téléphone ?",
      qAddress: "Quelle est votre adresse ?",
      qContact: "Comment puis-je vous contacter ?",
      chatWelcome: "Bonjour ! Posez ici votre question sur le contact, les horaires ou les écoles.",
      chatTyping: "Le chatbot écrit...",
      chatFallback: "Merci pour votre question. Utilisez le formulaire de contact, nous répondrons dès que possible.",
      chatResetDone: "Le chat a été réinitialisé. N’hésitez pas à poser votre question.",
      aEmail: "Vous pouvez nous écrire à pcpocontact@gmail.com. Vous pouvez aussi utiliser le formulaire de cette page.",
      aPhone: "Vous pouvez nous appeler au 0180620533 pendant les horaires scolaires.",
      aAddress: "Notre adresse est Achterom 70, 2991 CV Barendrecht.",
      aHours: "Pour les horaires actuels, veuillez appeler ou envoyer un e-mail.",
      aSchools: "Pour les questions sur les écoles ou l’inscription, envoyez un message via le formulaire.",
      aGreeting: "Bonjour ! Comment puis-je vous aider ?"
    },
    es: {
      pageTitle: "Contacto",
      translateLabel: "Traducir toda la página:",
      navSchoolInfo: "Información escolar",
      navSchoolFit: "¿Qué escuela se adapta a tu hijo?",
      navSchools: "Nuestras escuelas",
      navContact: "Contacto",
      navHome: "Inicio",
      emailTitle: "Correo electrónico",
      emailText: "Envíanos tus preguntas",
      phoneTitle: "Teléfono",
      phoneText: "Llámanos",
      addressTitle: "Dirección",
      formTitle: "Formulario de contacto",
      labelName: "Nombre",
      labelEmail: "Correo electrónico",
      labelSubject: "Asunto",
      labelMessage: "Mensaje",
      submit: "Enviar",
      formSending: "Enviando mensaje...",
      formSuccess: "¡Gracias! Tu mensaje ha sido enviado.",
      formError: "Error al enviar. Inténtalo de nuevo.",
      chatTitle: "PCPO Chatbot",
      chatStatus: "En línea • Respondemos rápido",
      chatInput: "Escribe tu pregunta...",
      chatSend: "Enviar",
      chatReset: "Limpiar chat",
      qaEmail: "Correo electrónico",
      qaPhone: "Teléfono",
      qaAddress: "Dirección",
      qaContact: "Contactar",
      qEmail: "¿Cuál es su correo electrónico?",
      qPhone: "¿Cuál es su número de teléfono?",
      qAddress: "¿Cuál es su dirección?",
      qContact: "¿Cómo puedo contactarles?",
      chatWelcome: "¡Hola! Haz aquí tu pregunta sobre contacto, horarios o escuelas.",
      chatTyping: "El chatbot está escribiendo...",
      chatFallback: "Gracias por tu pregunta. Usa el formulario de contacto y responderemos lo antes posible.",
      chatResetDone: "El chat se ha reiniciado. Puedes hacer tu pregunta.",
      aEmail: "Puedes escribirnos a pcpocontact@gmail.com. También puedes usar el formulario de esta página.",
      aPhone: "Puedes llamarnos al 0180620533 durante el horario escolar.",
      aAddress: "Nuestra dirección es Achterom 70, 2991 CV Barendrecht.",
      aHours: "Para horarios actualizados, lo mejor es llamar o enviar un correo.",
      aSchools: "Para preguntas sobre escuelas o inscripción, envía un mensaje mediante el formulario.",
      aGreeting: "¡Hola! ¿En qué puedo ayudarte?"
    }
  };

  const languageSelect = document.getElementById("languageSelect");
  const languageToggle = document.getElementById("languageToggle");
  const languageToggleFlag = document.getElementById("languageToggleFlag");
  const languageMenu = document.getElementById("languageMenu");
  const contactForm = document.getElementById("contactForm");
  const contactSubmit = document.getElementById("contactSubmit");
  const formFeedback = document.getElementById("formFeedback");

  let currentLanguage = "nl";
  const CHAT_STORAGE_KEY = "pcpo-chat-history-v4";

  function getLocaleText(key) {
    const dict = i18n[currentLanguage] || i18n.nl;
    return dict[key] || i18n.nl[key] || "";
  }

  function getLanguageFlag(language) {
    if (language === "en") return "🇬🇧";
    if (language === "de") return "🇩🇪";
    if (language === "fr") return "🇫🇷";
    if (language === "es") return "🇪🇸";
    return "🇳🇱";
  }

  function updateLanguageToggleLabel() {
    if (!languageToggleFlag) return;
    languageToggleFlag.textContent = `🇳🇱 / ${getLanguageFlag(currentLanguage)}`;
  }

  function setLanguage(lang) {
    currentLanguage = i18n[lang] ? lang : "nl";

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      const translated = getLocaleText(key);
      if (translated) node.textContent = translated;
    });

    updateLanguageToggleLabel();
    document.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: currentLanguage } }));
  }

  function detectStartLanguage() {
    const browser = (navigator.language || "nl").slice(0, 2).toLowerCase();

    try {
      const rawHistory = localStorage.getItem(CHAT_STORAGE_KEY);
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory);
        if (parsed?.language && i18n[parsed.language]) return parsed.language;
      }
    } catch {
      // Ignore invalid localStorage data and fall back to browser language.
    }

    return i18n[browser] ? browser : "nl";
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        subject: String(formData.get("subject") || "").trim(),
        message: String(formData.get("message") || "").trim()
      };

      if (!payload.name || !payload.subject || !payload.message || !validEmail(payload.email)) {
        if (formFeedback) {
          formFeedback.textContent = getLocaleText("formError");
          formFeedback.className = "form-feedback form-feedback--error";
        }
        return;
      }

      if (formFeedback) {
        formFeedback.textContent = getLocaleText("formSending");
        formFeedback.className = "form-feedback form-feedback--info";
      }
      if (contactSubmit) contactSubmit.disabled = true;

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Request failed");

        contactForm.reset();
        if (formFeedback) {
          formFeedback.textContent = getLocaleText("formSuccess");
          formFeedback.className = "form-feedback form-feedback--success";
        }
      } catch {
        if (formFeedback) {
          formFeedback.textContent = getLocaleText("formError");
          formFeedback.className = "form-feedback form-feedback--error";
        }
      } finally {
        if (contactSubmit) contactSubmit.disabled = false;
      }
    });
  }

  const defaultLanguage = detectStartLanguage();

  if (languageSelect) {
    languageSelect.value = defaultLanguage;
    languageSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  }

  if (languageToggle && languageMenu && languageSelect) {
    languageToggle.addEventListener("click", () => {
      const isOpen = languageMenu.hidden === false;
      languageMenu.hidden = isOpen;
      languageToggle.setAttribute("aria-expanded", String(!isOpen));
    });

    languageMenu.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const lang = target.getAttribute("data-language-option");
      if (!lang) return;

      languageSelect.value = lang;
      setLanguage(lang);
      languageMenu.hidden = true;
      languageToggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (event) => {
      if (!languageMenu || !languageToggle) return;
      if (languageMenu.hidden) return;
      if (event.target instanceof Node && (languageMenu.contains(event.target) || languageToggle.contains(event.target))) return;
      languageMenu.hidden = true;
      languageToggle.setAttribute("aria-expanded", "false");
    });
  }

  window.getLocaleText = getLocaleText;
  window.getCurrentLanguage = () => currentLanguage;
  window.setAppLanguage = setLanguage;

  setLanguage(defaultLanguage);

});