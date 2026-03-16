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
    navSchoolInfo: "Over PCPO",
    navSchoolFit: "Welke school past bij jouw kind?",
    navSchools: "Onze scholen",
    navContact: "Contact",
    navHome: "Home",
    metaTitleHome: "Home",
    metaTitleInfo: "Wist je dat?",
    metaTitleSchools: "Onze scholen",
    metaTitleContact: "Contact",
    metaTitleNews: "Nieuws",
    metaTitleAgenda: "Agenda",
    pageWorkAtPcpo: "Werken bij PCPO",
    pageNews: "Nieuws",
    pageAgenda: "Agenda",
    videoOpen: "Open video in volledig scherm",
    videoClose: "Sluit video",
    videoFrameTitle: "PCPO video",
    videoThumbAlt: "Thumbnail van de video",
    translateAria: "Kies een taal",
    mapTitle: "Onze scholen",
    mapSectionAria: "Kaart en schoolzoeker",
    mapSearchPlaceholder: "Vul adres in",
    mapSearchButton: "Zoeken",
    mapFilterLocations: "Filter locaties",
    mapCity: "Stad",
    mapFilterButton: "Filter",
    mapStatusFilterActive: "Filter actief. Beweeg met de muis over een marker om naam en adres te zien.",
    mapAria: "Kaart met schoollocaties",
    mapFullscreen: "Schermvullend",
    mapFullscreenExit: "Verkleinen",
    mapResultsTitle: "Scholen op afstand (dichtstbij eerst)",
    mapHint: "Tip: beweeg met je muis over een blauwe marker om naam en adres te zien.",
    mapSchoolOverviewAria: "Scholenoverzicht",
    mapCardContact: "Neem contact op met de school voor meer info.",
    mapCardMoreInfo: "Meer info",
    mapCardWebsite: "Website",
    mapLogoAltPrefix: "Logo van",
    mapLookupFailed: "Adres opzoeken mislukt",
    mapStatusNoSchools: "Geen scholen gevonden voor deze filter.",
    mapStatusFillAddress: "Vul eerst een adres in.",
    mapStatusSearching: "Adres zoeken...",
    mapStatusNotFound: "Adres niet gevonden. Probeer een vollediger adres.",
    mapYourAddress: "Jouw adres",
    mapStatusFound: "Adres gevonden. Scholen staan hieronder van dichtbij naar verder.",
    mapStatusFailed: "Zoeken mislukt. Controleer het adres en probeer opnieuw.",
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
    aGreeting: "Hoi! Waar kan ik je mee helpen?",
    quizKicker: "PCPO Schoolmatch",
    quizSubtitle: "Ontdek in een paar stappen welke school het best aansluit.",
    quizTitle: "welke school past bij jouw kind?",
    quizAddressLabel: "Vul eerst je adres in:",
    quizAddressPlaceholder: "Bijvoorbeeld: Achterom 70, Barendrecht",
    quizAddressButton: "Start quiz",
    quizAddressEmpty: "Vul eerst een adres in.",
    quizAddressLoading: "Adres wordt opgezocht...",
    quizAddressError: "Adres niet gevonden. Probeer een completer adres.",
    quizQuestionProgress: "Vraag {current} van {total}",
    quizResultsTitle: "Ranglijst best passende scholen",
    quizTopMatch: "Beste match: {school}",
    quizReadMore: "Lees meer over {school} op de Onze scholen pagina.",
    quizRestart: "Quiz opnieuw doen",
    quizQ1: "Vind je talentontwikkeling erg belangrijk op school?",
    quizQ2: "Vind je een duidelijk christelijke identiteit belangrijk?",
    quizQ3: "Vind je samenwerking met ouders belangrijk?",
    quizQ4: "Vind je persoonlijke aandacht voor ieder kind belangrijker dan klassikaal onderwijs?",
    quizQ5: "Vind je modern onderwijs belangrijk?",
    quizQ6: "Vind je diversiteit belangrijk op school?",
    quizQ7: "Vind je Engels en internationale oriëntatie belangrijk?",
    quizQ8: "Wat vind jij het belangrijkste op een school?",
    quizQ9: "Welke schoolomgeving spreekt je het meest aan?",
    quizYes: "Ja",
    quizNo: "Nee",
    quizO8A: "A. Talentontwikkeling",
    quizO8B: "B. Christelijke waarden",
    quizO8C: "C. Groei van kinderen",
    quizO8D: "D. Verschillende niveaus begeleiden",
    quizO8E: "E. Modern onderwijs",
    quizO8F: "F. Algemene basisschool",
    quizO8G: "G. Persoonlijk onderwijs",
    quizO8H: "H. Diversiteit",
    quizO8I: "I. Samenwerking met ouders",
    quizO8J: "J. Persoonlijke aandacht",
    quizO8K: "K. Engels en internationaal",
    quizO9A: "A. Veilig en talentgericht",
    quizO9B: "B. Sterk christelijke school",
    quizO9C: "C. Groei en ontwikkeling centraal",
    quizO9D: "D. Aandacht voor verschillende niveaus",
    quizO9E: "E. Moderne school",
    quizO9F: "F. Gewone basisschool",
    quizO9G: "G. Persoonlijke begeleiding",
    quizO9H: "H. Diverse school",
    quizO9I: "I. Samenwerking met ouders",
    quizO9J: "J. Veel persoonlijke aandacht",
    quizO9K: "K. Internationale school",
    videoText2: "Een kijkje op één van onze scholen",
    videoText3: "Wat doet een rekenspecialist op een school",
    videoText4: "Wat doet een kleuterjuf",
  };

  const i18n = {
    nl: baseNl,
    en: {
      pageTitle: "Contact",
      translateLabel: "Translate the full page:",
      navSchoolInfo: "About PCPO",
      navSchoolFit: "Which school fits your child?",
      navSchools: "Our schools",
      navContact: "Contact",
      navHome: "Home",
      metaTitleHome: "Home",
      metaTitleInfo: "Did you know?",
      metaTitleSchools: "Our schools",
      metaTitleContact: "Contact",
      metaTitleNews: "News",
      metaTitleAgenda: "Agenda",
      pageWorkAtPcpo: "Working at PCPO",
      pageNews: "News",
      pageAgenda: "Agenda",
      videoOpen: "Open video in full screen",
      videoClose: "Close video",
      videoFrameTitle: "PCPO video",
      videoThumbAlt: "Video thumbnail",
      translateAria: "Choose a language",
      mapTitle: "Our schools",
      mapSectionAria: "Map and school search",
      mapSearchPlaceholder: "Enter address",
      mapSearchButton: "Search",
      mapFilterLocations: "Filter locations",
      mapCity: "City",
      mapFilterButton: "Filter",
      mapStatusFilterActive: "Filter active. Hover over a marker to see name and address.",
      mapAria: "Map with school locations",
      mapFullscreen: "Fullscreen",
      mapFullscreenExit: "Minimize",
      mapResultsTitle: "Schools by distance (nearest first)",
      mapHint: "Tip: move your mouse over a blue marker to see name and address.",
      mapSchoolOverviewAria: "School overview",
      mapCardContact: "Contact the school for more information.",
      mapCardMoreInfo: "More info",
      mapCardWebsite: "Website",
      mapLogoAltPrefix: "Logo of",
      mapLookupFailed: "Address lookup failed",
      mapStatusNoSchools: "No schools found for this filter.",
      mapStatusFillAddress: "Please enter an address first.",
      mapStatusSearching: "Searching address...",
      mapStatusNotFound: "Address not found. Try a more complete address.",
      mapYourAddress: "Your address",
      mapStatusFound: "Address found. Schools are listed below from nearest to farthest.",
      mapStatusFailed: "Search failed. Check the address and try again.",
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
      aGreeting: "Hi! How can I help you?",
      quizKicker: "PCPO Schoolmatch",
      quizSubtitle: "Discover in a few steps which school matches best.",
      quizTitle: "Which school fits your child?",
      quizAddressLabel: "Enter your address first:",
      quizAddressPlaceholder: "Example: Achterom 70, Barendrecht",
      quizAddressButton: "Start quiz",
      quizAddressEmpty: "Please enter an address first.",
      quizAddressLoading: "Looking up address...",
      quizAddressError: "Address not found. Please try a more complete address.",
      quizQuestionProgress: "Question {current} of {total}",
      quizResultsTitle: "Ranking of best matching schools",
      quizTopMatch: "Best match: {school}",
      quizReadMore: "Read more about {school} on the Our schools page.",
      quizRestart: "Restart quiz",
      quizQ1: "Is talent development very important to you at school?",
      quizQ2: "Is a clear Christian identity important to you?",
      quizQ3: "Is cooperation with parents important to you?",
      quizQ4: "Is personal attention for each child more important than whole-class teaching?",
      quizQ5: "Is modern education important to you?",
      quizQ6: "Is diversity important to you at school?",
      quizQ7: "Is English and international orientation important to you?",
      quizQ8: "What is most important to you in a school?",
      quizQ9: "Which school environment appeals most to you?",
      quizYes: "Yes",
      quizNo: "No",
      quizO8A: "A. Talent development",
      quizO8B: "B. Christian values",
      quizO8C: "C. Child development",
      quizO8D: "D. Guidance for different levels",
      quizO8E: "E. Modern education",
      quizO8F: "F. General primary school",
      quizO8G: "G. Personal education",
      quizO8H: "H. Diversity",
      quizO8I: "I. Cooperation with parents",
      quizO8J: "J. Personal attention",
      quizO8K: "K. English and international",
      quizO9A: "A. Safe and talent-focused",
      quizO9B: "B. Strong Christian school",
      quizO9C: "C. Growth and development central",
      quizO9D: "D. Attention to different levels",
      quizO9E: "E. Modern school",
      quizO9F: "F. Regular primary school",
      quizO9G: "G. Personal guidance",
      quizO9H: "H. Diverse school",
      quizO9I: "I. Cooperation with parents",
      quizO9J: "J. Lots of personal attention",
      quizO9K: "K. International school",
      videoText2: "A glimpse into one of our schools",
      videoText3: "What does a mathematics specialist do in a school",
      videoText4: "What does a nursery teacher do",
    },
    de: {
      pageTitle: "Kontakt",
      translateLabel: "Gesamte Seite übersetzen:",
      navSchoolInfo: "Über PCPO",
      navSchoolFit: "Welche Schule passt zu Ihrem Kind?",
      navSchools: "Unsere Schulen",
      navContact: "Kontakt",
      navHome: "Startseite",
      metaTitleHome: "Startseite",
      metaTitleInfo: "Wussten Sie schon?",
      metaTitleSchools: "Unsere Schulen",
      metaTitleContact: "Kontakt",
      metaTitleNews: "Nachrichten",
      metaTitleAgenda: "Agenda",
      pageWorkAtPcpo: "Arbeiten bei PCPO",
      pageNews: "Nachrichten",
      pageAgenda: "Agenda",
      videoOpen: "Video im Vollbild öffnen",
      videoClose: "Video schließen",
      videoFrameTitle: "PCPO-Video",
      videoThumbAlt: "Video-Vorschaubild",
      translateAria: "Sprache wählen",
      mapTitle: "Unsere Schulen",
      mapSectionAria: "Karte und Schulsuche",
      mapSearchPlaceholder: "Adresse eingeben",
      mapSearchButton: "Suchen",
      mapFilterLocations: "Standorte filtern",
      mapCity: "Stadt",
      mapFilterButton: "Filtern",
      mapStatusFilterActive: "Filter aktiv. Bewegen Sie die Maus über einen Marker, um Name und Adresse zu sehen.",
      mapAria: "Karte mit Schulstandorten",
      mapFullscreen: "Vollbild",
      mapFullscreenExit: "Verkleinern",
      mapResultsTitle: "Schulen nach Entfernung (nächste zuerst)",
      mapHint: "Tipp: Bewegen Sie die Maus über einen blauen Marker, um Namen und Adresse zu sehen.",
      mapSchoolOverviewAria: "Schulübersicht",
      mapCardContact: "Kontaktieren Sie die Schule für mehr Informationen.",
      mapCardMoreInfo: "Mehr Infos",
      mapCardWebsite: "Webseite",
      mapLogoAltPrefix: "Logo von",
      mapLookupFailed: "Adresssuche fehlgeschlagen",
      mapStatusNoSchools: "Keine Schulen für diesen Filter gefunden.",
      mapStatusFillAddress: "Bitte geben Sie zuerst eine Adresse ein.",
      mapStatusSearching: "Adresse wird gesucht...",
      mapStatusNotFound: "Adresse nicht gefunden. Bitte vollständiger eingeben.",
      mapYourAddress: "Ihre Adresse",
      mapStatusFound: "Adresse gefunden. Schulen stehen unten von nah bis fern.",
      mapStatusFailed: "Suche fehlgeschlagen. Prüfen Sie die Adresse und versuchen Sie es erneut.",
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
      aGreeting: "Hallo! Wie kann ich Ihnen helfen?",
      quizKicker: "PCPO Schoolmatch",
      quizSubtitle: "Entdecken Sie in wenigen Schritten, welche Schule am besten passt.",
      quizTitle: "Welche Schule passt zu Ihrem Kind?",
      quizAddressLabel: "Geben Sie zuerst Ihre Adresse ein:",
      quizAddressPlaceholder: "Beispiel: Achterom 70, Barendrecht",
      quizAddressButton: "Quiz starten",
      quizAddressEmpty: "Bitte geben Sie zuerst eine Adresse ein.",
      quizAddressLoading: "Adresse wird gesucht...",
      quizAddressError: "Adresse nicht gefunden. Bitte vollständiger eingeben.",
      quizQuestionProgress: "Frage {current} von {total}",
      quizResultsTitle: "Rangliste der passendsten Schulen",
      quizTopMatch: "Beste Übereinstimmung: {school}",
      quizReadMore: "Lesen Sie mehr über {school} auf der Seite Unsere Schulen.",
      quizRestart: "Quiz neu starten",
      quizQ1: "Ist Talententwicklung in der Schule für Sie sehr wichtig?",
      quizQ2: "Ist eine klare christliche Identität für Sie wichtig?",
      quizQ3: "Ist die Zusammenarbeit mit Eltern für Sie wichtig?",
      quizQ4: "Ist persönliche Aufmerksamkeit für jedes Kind wichtiger als Frontalunterricht?",
      quizQ5: "Ist moderner Unterricht für Sie wichtig?",
      quizQ6: "Ist Vielfalt in der Schule für Sie wichtig?",
      quizQ7: "Sind Englisch und internationale Orientierung für Sie wichtig?",
      quizQ8: "Was ist Ihnen an einer Schule am wichtigsten?",
      quizQ9: "Welche Schulumgebung spricht Sie am meisten an?",
      quizYes: "Ja",
      quizNo: "Nein",
      quizO8A: "A. Talententwicklung",
      quizO8B: "B. Christliche Werte",
      quizO8C: "C. Entwicklung von Kindern",
      quizO8D: "D. Begleitung unterschiedlicher Niveaus",
      quizO8E: "E. Moderner Unterricht",
      quizO8F: "F. Allgemeine Grundschule",
      quizO8G: "G. Persönlicher Unterricht",
      quizO8H: "H. Vielfalt",
      quizO8I: "I. Zusammenarbeit mit Eltern",
      quizO8J: "J. Persönliche Aufmerksamkeit",
      quizO8K: "K. Englisch und international",
      quizO9A: "A. Sicher und talentorientiert",
      quizO9B: "B. Stark christliche Schule",
      quizO9C: "C. Wachstum und Entwicklung im Mittelpunkt",
      quizO9D: "D. Aufmerksamkeit für verschiedene Niveaus",
      quizO9E: "E. Moderne Schule",
      quizO9F: "F. Normale Grundschule",
      quizO9G: "G. Persönliche Begleitung",
      quizO9H: "H. Vielfältige Schule",
      quizO9I: "I. Zusammenarbeit mit Eltern",
      quizO9J: "J. Viel persönliche Aufmerksamkeit",
      quizO9K: "K. Internationale Schule",    
      videoText2: "Ein Blick in eine unserer Schulen",
      videoText3: "Was macht ein Mathematik-Spezialist in einer Schule",
      videoText4: "Was macht eine Kindergärtner",
    },
    fr: {
      pageTitle: "Contact",
      translateLabel: "Traduire toute la page :",
      navSchoolInfo: "À propos de PCPO",
      navSchoolFit: "Quelle école convient à votre enfant ?",
      navSchools: "Nos écoles",
      navContact: "Contact",
      navHome: "Accueil",
      metaTitleHome: "Accueil",
      metaTitleInfo: "Le saviez-vous ?",
      metaTitleSchools: "Nos écoles",
      metaTitleContact: "Contact",
      metaTitleNews: "Actualités",
      metaTitleAgenda: "Agenda",
      pageWorkAtPcpo: "Travailler chez PCPO",
      pageNews: "Actualités",
      pageAgenda: "Agenda",
      videoOpen: "Ouvrir la vidéo en plein écran",
      videoClose: "Fermer la vidéo",
      videoFrameTitle: "Vidéo PCPO",
      videoThumbAlt: "Miniature de la vidéo",
      translateAria: "Choisir une langue",
      mapTitle: "Nos écoles",
      mapSectionAria: "Carte et recherche d'école",
      mapSearchPlaceholder: "Saisir l'adresse",
      mapSearchButton: "Rechercher",
      mapFilterLocations: "Filtrer les lieux",
      mapCity: "Ville",
      mapFilterButton: "Filtrer",
      mapStatusFilterActive: "Filtre actif. Survolez un marqueur pour voir le nom et l'adresse.",
      mapAria: "Carte des emplacements des écoles",
      mapFullscreen: "Plein écran",
      mapFullscreenExit: "Réduire",
      mapResultsTitle: "Écoles par distance (les plus proches d'abord)",
      mapHint: "Astuce : passez la souris sur un marqueur bleu pour voir le nom et l'adresse.",
      mapSchoolOverviewAria: "Aperçu des écoles",
      mapCardContact: "Contactez l'école pour plus d'informations.",
      mapCardMoreInfo: "Plus d'infos",
      mapCardWebsite: "Site web",
      mapLogoAltPrefix: "Logo de",
      mapLookupFailed: "Échec de la recherche d'adresse",
      mapStatusNoSchools: "Aucune école trouvée pour ce filtre.",
      mapStatusFillAddress: "Saisissez d'abord une adresse.",
      mapStatusSearching: "Recherche de l'adresse...",
      mapStatusNotFound: "Adresse introuvable. Essayez une adresse plus complète.",
      mapYourAddress: "Votre adresse",
      mapStatusFound: "Adresse trouvée. Les écoles sont listées ci-dessous de la plus proche à la plus éloignée.",
      mapStatusFailed: "La recherche a échoué. Vérifiez l'adresse et réessayez.",
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
      aGreeting: "Bonjour ! Comment puis-je vous aider ?",
      quizKicker: "PCPO Schoolmatch",
      quizSubtitle: "Découvrez en quelques étapes l’école qui convient le mieux.",
      quizTitle: "Quelle école convient à votre enfant ?",
      quizAddressLabel: "Saisissez d’abord votre adresse :",
      quizAddressPlaceholder: "Exemple : Achterom 70, Barendrecht",
      quizAddressButton: "Démarrer le quiz",
      quizAddressEmpty: "Veuillez d’abord saisir une adresse.",
      quizAddressLoading: "Recherche de l’adresse...",
      quizAddressError: "Adresse introuvable. Essayez une adresse plus complète.",
      quizQuestionProgress: "Question {current} sur {total}",
      quizResultsTitle: "Classement des écoles les plus adaptées",
      quizTopMatch: "Meilleure correspondance : {school}",
      quizReadMore: "En savoir plus sur {school} sur la page Nos écoles.",
      quizRestart: "Recommencer le quiz",
      quizQ1: "Le développement des talents est-il très important pour vous à l’école ?",
      quizQ2: "Une identité chrétienne claire est-elle importante pour vous ?",
      quizQ3: "La collaboration avec les parents est-elle importante pour vous ?",
      quizQ4: "L’attention personnelle pour chaque enfant est-elle plus importante que l’enseignement collectif ?",
      quizQ5: "L’enseignement moderne est-il important pour vous ?",
      quizQ6: "La diversité est-elle importante pour vous à l’école ?",
      quizQ7: "L’anglais et l’orientation internationale sont-ils importants pour vous ?",
      quizQ8: "Qu’est-ce qui est le plus important pour vous dans une école ?",
      quizQ9: "Quel environnement scolaire vous attire le plus ?",
      quizYes: "Oui",
      quizNo: "Non",
      quizO8A: "A. Développement des talents",
      quizO8B: "B. Valeurs chrétiennes",
      quizO8C: "C. Développement de l’enfant",
      quizO8D: "D. Accompagnement de différents niveaux",
      quizO8E: "E. Enseignement moderne",
      quizO8F: "F. École primaire générale",
      quizO8G: "G. Enseignement personnalisé",
      quizO8H: "H. Diversité",
      quizO8I: "I. Collaboration avec les parents",
      quizO8J: "J. Attention personnelle",
      quizO8K: "K. Anglais et international",
      quizO9A: "A. Sûr et axé sur les talents",
      quizO9B: "B. École fortement chrétienne",
      quizO9C: "C. Croissance et développement au centre",
      quizO9D: "D. Attention aux différents niveaux",
      quizO9E: "E. École moderne",
      quizO9F: "F. École primaire classique",
      quizO9G: "G. Accompagnement personnel",
      quizO9H: "H. École diversifiée",
      quizO9I: "I. Collaboration avec les parents",
      quizO9J: "J. Beaucoup d’attention personnelle",
      quizO9K: "K. École internationale",
      videoText2: "Un aperçu de l'une de nos écoles",
      videoText3: "Que fait un spécialiste en mathématiques à l'école",
      videoText4: "Que fait une enseignante de maternelle",
    },
    es: {
      pageTitle: "Contacto",
      translateLabel: "Traducir toda la página:",
      navSchoolInfo: "Acerca de PCPO",
      navSchoolFit: "¿Qué escuela se adapta a tu hijo?",
      navSchools: "Nuestras escuelas",
      navContact: "Contacto",
      navHome: "Inicio",
      metaTitleHome: "Inicio",
      metaTitleInfo: "¿Sabías que...?",
      metaTitleSchools: "Nuestras escuelas",
      metaTitleContact: "Contacto",
      metaTitleNews: "Noticias",
      metaTitleAgenda: "Agenda",
      pageWorkAtPcpo: "Trabajar en PCPO",
      pageNews: "Noticias",
      pageAgenda: "Agenda",
      videoOpen: "Abrir video en pantalla completa",
      videoClose: "Cerrar video",
      videoFrameTitle: "Video de PCPO",
      videoThumbAlt: "Miniatura del video",
      translateAria: "Elegir un idioma",
      mapTitle: "Nuestras escuelas",
      mapSectionAria: "Mapa y buscador de escuelas",
      mapSearchPlaceholder: "Introduce dirección",
      mapSearchButton: "Buscar",
      mapFilterLocations: "Filtrar ubicaciones",
      mapCity: "Ciudad",
      mapFilterButton: "Filtrar",
      mapStatusFilterActive: "Filtro activo. Pasa el ratón sobre un marcador para ver nombre y dirección.",
      mapAria: "Mapa con ubicaciones de escuelas",
      mapFullscreen: "Pantalla completa",
      mapFullscreenExit: "Reducir",
      mapResultsTitle: "Escuelas por distancia (más cercanas primero)",
      mapHint: "Consejo: mueve el ratón sobre un marcador azul para ver nombre y dirección.",
      mapSchoolOverviewAria: "Resumen de escuelas",
      mapCardContact: "Contacta con la escuela para más información.",
      mapCardMoreInfo: "Más información",
      mapCardWebsite: "Sitio web",
      mapLogoAltPrefix: "Logo de",
      mapLookupFailed: "Error al buscar la dirección",
      mapStatusNoSchools: "No se encontraron escuelas para este filtro.",
      mapStatusFillAddress: "Primero introduce una dirección.",
      mapStatusSearching: "Buscando dirección...",
      mapStatusNotFound: "Dirección no encontrada. Prueba con una dirección más completa.",
      mapYourAddress: "Tu dirección",
      mapStatusFound: "Dirección encontrada. Las escuelas se muestran abajo de la más cercana a la más lejana.",
      mapStatusFailed: "La búsqueda falló. Comprueba la dirección e inténtalo de nuevo.",
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
      aGreeting: "¡Hola! ¿En qué puedo ayudarte?",
      quizKicker: "PCPO Schoolmatch",
      quizSubtitle: "Descubre en pocos pasos qué escuela encaja mejor.",
      quizTitle: "¿Qué escuela se adapta a tu hijo?",
      quizAddressLabel: "Primero introduce tu dirección:",
      quizAddressPlaceholder: "Ejemplo: Achterom 70, Barendrecht",
      quizAddressButton: "Iniciar quiz",
      quizAddressEmpty: "Primero introduce una dirección.",
      quizAddressLoading: "Buscando dirección...",
      quizAddressError: "Dirección no encontrada. Prueba con una dirección más completa.",
      quizQuestionProgress: "Pregunta {current} de {total}",
      quizResultsTitle: "Clasificación de escuelas más adecuadas",
      quizTopMatch: "Mejor opción: {school}",
      quizReadMore: "Lee más sobre {school} en la página Nuestras escuelas.",
      quizRestart: "Reiniciar quiz",
      quizQ1: "¿Es muy importante para ti el desarrollo de talentos en la escuela?",
      quizQ2: "¿Es importante para ti una identidad cristiana clara?",
      quizQ3: "¿Es importante para ti la colaboración con los padres?",
      quizQ4: "¿Es más importante la atención personal para cada niño que la enseñanza en grupo?",
      quizQ5: "¿Es importante para ti la educación moderna?",
      quizQ6: "¿Es importante para ti la diversidad en la escuela?",
      quizQ7: "¿Son importantes para ti el inglés y la orientación internacional?",
      quizQ8: "¿Qué es lo más importante para ti en una escuela?",
      quizQ9: "¿Qué entorno escolar te atrae más?",
      quizYes: "Sí",
      quizNo: "No",
      quizO8A: "A. Desarrollo de talentos",
      quizO8B: "B. Valores cristianos",
      quizO8C: "C. Desarrollo infantil",
      quizO8D: "D. Guiar diferentes niveles",
      quizO8E: "E. Educación moderna",
      quizO8F: "F. Escuela primaria general",
      quizO8G: "G. Educación personalizada",
      quizO8H: "H. Diversidad",
      quizO8I: "I. Colaboración con padres",
      quizO8J: "J. Atención personal",
      quizO8K: "K. Inglés e internacional",
      quizO9A: "A. Seguro y orientado al talento",
      quizO9B: "B. Escuela fuertemente cristiana",
      quizO9C: "C. Crecimiento y desarrollo como eje",
      quizO9D: "D. Atención a diferentes niveles",
      quizO9E: "E. Escuela moderna",
      quizO9F: "F. Escuela primaria común",
      quizO9G: "G. Orientación personal",
      quizO9H: "H. Escuela diversa",
      quizO9I: "I. Colaboración con padres",
      quizO9J: "J. Mucha atención personal",
      quizO9K: "K. Escuela internacional",
      videoText2: "Un vistazo a una de nuestras escuelas",
      videoText3: "¿Qué hace un especialista en matemáticas en una escuela?",
      videoText4: "¿Qué hace una maestra de primaria?",
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

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      const translated = getLocaleText(key);
      if (translated) node.setAttribute("placeholder", translated);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      const key = node.getAttribute("data-i18n-aria-label");
      const translated = getLocaleText(key);
      if (translated) node.setAttribute("aria-label", translated);
    });

    document.querySelectorAll("[data-i18n-title]").forEach((node) => {
      const key = node.getAttribute("data-i18n-title");
      const translated = getLocaleText(key);
      if (translated) node.setAttribute("title", translated);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((node) => {
      const key = node.getAttribute("data-i18n-alt");
      const translated = getLocaleText(key);
      if (translated) node.setAttribute("alt", translated);
    });

    const titleNode = document.querySelector("title[data-i18n]");
    if (titleNode) {
      const titleKey = titleNode.getAttribute("data-i18n");
      const translatedTitle = getLocaleText(titleKey);
      if (translatedTitle) document.title = translatedTitle;
    }

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

  const quizIntro = document.getElementById("quizIntro");
  const quizAddressInput = document.getElementById("quizAddressInput");
  const quizAddressStart = document.getElementById("quizAddressStart");
  const quizAddressStatus = document.getElementById("quizAddressStatus");
  const quizQuestionWrap = document.getElementById("quizQuestionWrap");
  const quizProgress = document.getElementById("quizProgress");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizResults = document.getElementById("quizResults");
  const quizRanking = document.getElementById("quizRanking");
  const quizTopMatch = document.getElementById("quizTopMatch");
  const quizReadMoreLink = document.getElementById("quizReadMoreLink");
  const restartQuiz = document.getElementById("restartQuiz");

  if (
    quizIntro && quizAddressInput && quizAddressStart && quizAddressStatus &&
    quizQuestionWrap && quizProgress && quizQuestion && quizOptions &&
    quizResults && quizRanking && quizTopMatch && quizReadMoreLink && restartQuiz
  ) {
    const schoolLocations = [
      { name: "CBS De Ark", lat: 51.85667, lon: 4.53472 },
      { name: "CBS De Bongerd", lat: 51.8646633, lon: 4.6135642 },
      { name: "CBS De Fontein", lat: 51.8912258, lon: 4.5790103 },
      { name: "CBS De Hoeksteen", lat: 51.852674755859375, lon: 4.547271728515625 },
      { name: "CBS De Klimop", lat: 51.871284, lon: 4.5914643 },
      { name: "CBS De Regenboog", lat: 51.885218, lon: 4.6051965 },
      { name: "CBS De Vrijenburg", lat: 51.8589301, lon: 4.5062779 },
      { name: "CBS De Wingerd", lat: 51.8627854, lon: 4.6042018 },
      { name: "CBS Groen van Prinsterer", lat: 51.85, lon: 4.5295 },
      { name: "CBS Groen van Prinsterer", lat: 51.845301, lon: 4.5265 },
      { name: "CBS Het Kompas", lat: 51.8569395, lon: 4.5293586 },
      { name: "CBS Smitshoek", lat: 51.85424313964844, lon: 4.491832669830322 },
      { name: "CBS Smitshoek", lat: 51.857628411865234, lon: 4.493868350982666 },
      { name: "CBS Smitshoek", lat: 51.8597538, lon: 4.4940023 }
    ];

    const schoolNames = [
      "CBS De Ark",
      "CBS De Hoeksteen",
      "CBS Het Kompas",
      "CBS Groen van Prinsterer",
      "CBS De Vrijenburg",
      "CBS Smitshoek",
      "CBS De Fontein",
      "CBS De Regenboog",
      "CBS De Klimop",
      "CBS De Wingerd",
      "CBS De Bongerd"
    ];

    const quizQuestions = [
      {
        textKey: "quizQ1",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Ark": 1, "CBS Groen van Prinsterer": 1, "CBS De Fontein": 1, "CBS De Regenboog": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Hoeksteen": 1, "CBS Het Kompas": 1, "CBS De Vrijenburg": 1, "CBS De Klimop": 1, "CBS De Wingerd": 1 } }
        ]
      },
      {
        textKey: "quizQ2",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Hoeksteen": 1, "CBS Groen van Prinsterer": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Ark": 1, "CBS Het Kompas": 1, "CBS De Vrijenburg": 1, "CBS De Fontein": 1, "CBS De Regenboog": 1 } }
        ]
      },
      {
        textKey: "quizQ3",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Ark": 1, "CBS De Vrijenburg": 1, "CBS De Klimop": 1 } },
          { labelKey: "quizNo", scores: { "CBS Het Kompas": 1, "CBS De Wingerd": 1, "CBS De Fontein": 1 } }
        ]
      },
      {
        textKey: "quizQ4",
        options: [
          { labelKey: "quizYes", scores: { "CBS Het Kompas": 1, "CBS De Wingerd": 1, "CBS De Fontein": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Ark": 1, "CBS De Vrijenburg": 1, "CBS De Klimop": 1 } }
        ]
      },
      {
        textKey: "quizQ5",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Vrijenburg": 1, "CBS De Wingerd": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Hoeksteen": 1, "CBS Groen van Prinsterer": 1, "CBS Het Kompas": 1 } }
        ]
      },
      {
        textKey: "quizQ6",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Regenboog": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Hoeksteen": 1, "CBS Groen van Prinsterer": 1 } }
        ]
      },
      {
        textKey: "quizQ7",
        options: [
          { labelKey: "quizYes", scores: { "CBS De Bongerd": 1 } },
          { labelKey: "quizNo", scores: { "CBS De Ark": 1, "CBS Het Kompas": 1, "CBS De Klimop": 1 } }
        ]
      },
      {
        textKey: "quizQ8",
        options: [
          { labelKey: "quizO8A", scores: { "CBS De Ark": 2 } },
          { labelKey: "quizO8B", scores: { "CBS De Hoeksteen": 2 } },
          { labelKey: "quizO8C", scores: { "CBS Het Kompas": 2 } },
          { labelKey: "quizO8D", scores: { "CBS Groen van Prinsterer": 2 } },
          { labelKey: "quizO8E", scores: { "CBS De Vrijenburg": 2 } },
          { labelKey: "quizO8F", scores: { "CBS Smitshoek": 2 } },
          { labelKey: "quizO8G", scores: { "CBS De Fontein": 2 } },
          { labelKey: "quizO8H", scores: { "CBS De Regenboog": 2 } },
          { labelKey: "quizO8I", scores: { "CBS De Klimop": 2 } },
          { labelKey: "quizO8J", scores: { "CBS De Wingerd": 2 } },
          { labelKey: "quizO8K", scores: { "CBS De Bongerd": 2 } }
        ]
      },
      {
        textKey: "quizQ9",
        options: [
          { labelKey: "quizO9A", scores: { "CBS De Ark": 2 } },
          { labelKey: "quizO9B", scores: { "CBS De Hoeksteen": 2 } },
          { labelKey: "quizO9C", scores: { "CBS Het Kompas": 2 } },
          { labelKey: "quizO9D", scores: { "CBS Groen van Prinsterer": 2 } },
          { labelKey: "quizO9E", scores: { "CBS De Vrijenburg": 2 } },
          { labelKey: "quizO9F", scores: { "CBS Smitshoek": 2 } },
          { labelKey: "quizO9G", scores: { "CBS De Fontein": 2 } },
          { labelKey: "quizO9H", scores: { "CBS De Regenboog": 2 } },
          { labelKey: "quizO9I", scores: { "CBS De Klimop": 2 } },
          { labelKey: "quizO9J", scores: { "CBS De Wingerd": 2 } },
          { labelKey: "quizO9K", scores: { "CBS De Bongerd": 2 } }
        ]
      }
    ];

    let currentQuizQuestion = 0;
    let schoolScores = {};

    function translateTemplate(key, values = {}) {
      let text = getLocaleText(key) || "";
      Object.entries(values).forEach(([name, value]) => {
        text = text.replace(`{${name}}`, String(value));
      });
      return text;
    }

    function toRad(value) {
      return value * (Math.PI / 180);
    }

    function haversineDistanceKm(lat1, lon1, lat2, lon2) {
      const earthRadiusKm = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
    }

    function resetQuizScores() {
      schoolScores = Object.fromEntries(schoolNames.map((name) => [name, 0]));
    }

    function applyQuizScores(optionScores) {
      Object.entries(optionScores).forEach(([school, points]) => {
        schoolScores[school] = (schoolScores[school] || 0) + points;
      });
    }

    function applyDistanceBonus(lat, lon) {
      const nearestBySchool = schoolNames.map((schoolName) => {
        const locations = schoolLocations.filter((item) => item.name === schoolName);
        let nearestDistance = Number.POSITIVE_INFINITY;

        locations.forEach((location) => {
          const distance = haversineDistanceKm(lat, lon, location.lat, location.lon);
          if (distance < nearestDistance) nearestDistance = distance;
        });

        return { school: schoolName, distance: nearestDistance };
      }).sort((a, b) => a.distance - b.distance);

      nearestBySchool.forEach((entry, index) => {
        if (index < 3) {
          schoolScores[entry.school] += 3;
        } else if (index < 8) {
          schoolScores[entry.school] += 1;
        }
      });
    }

    function renderQuizQuestion() {
      const question = quizQuestions[currentQuizQuestion];
      quizProgress.textContent = translateTemplate("quizQuestionProgress", {
        current: currentQuizQuestion + 1,
        total: quizQuestions.length
      });
      quizQuestion.textContent = getLocaleText(question.textKey);
      quizOptions.innerHTML = "";

      question.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-option";
        button.textContent = getLocaleText(option.labelKey);

        button.addEventListener("click", () => {
          applyQuizScores(option.scores);
          currentQuizQuestion += 1;

          if (currentQuizQuestion < quizQuestions.length) {
            renderQuizQuestion();
            return;
          }

          showQuizResults();
        });

        quizOptions.appendChild(button);
      });
    }

    function showQuizResults() {
      const ranked = Object.entries(schoolScores).sort((a, b) => {
        if (b[1] === a[1]) return a[0].localeCompare(b[0], "nl");
        return b[1] - a[1];
      });

      const topSchool = ranked[0]?.[0] || "";
      quizTopMatch.textContent = translateTemplate("quizTopMatch", { school: topSchool });

      quizRanking.innerHTML = "";
      ranked.forEach(([school]) => {
        const item = document.createElement("li");
        item.textContent = school;
        quizRanking.appendChild(item);
      });

      quizReadMoreLink.textContent = translateTemplate("quizReadMore", { school: topSchool });
      quizReadMoreLink.href = "pagina3.html";

      quizQuestionWrap.hidden = true;
      quizResults.hidden = false;
    }

    function restartQuizFlow() {
      currentQuizQuestion = 0;
      resetQuizScores();
      quizAddressStatus.textContent = "";
      quizAddressInput.value = "";
      quizIntro.hidden = false;
      quizQuestionWrap.hidden = true;
      quizResults.hidden = true;
    }

    async function startQuizFromAddress() {
      const address = quizAddressInput.value.trim();
      if (!address) {
        quizAddressStatus.textContent = getLocaleText("quizAddressEmpty");
        return;
      }

      quizAddressStatus.textContent = getLocaleText("quizAddressLoading");

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const result = await response.json();
        const first = Array.isArray(result) ? result[0] : null;
        if (!first?.lat || !first?.lon) throw new Error("Address not found");

        currentQuizQuestion = 0;
        resetQuizScores();
        applyDistanceBonus(Number(first.lat), Number(first.lon));

        quizAddressStatus.textContent = "";
        quizIntro.hidden = true;
        quizResults.hidden = true;
        quizQuestionWrap.hidden = false;
        renderQuizQuestion();
      } catch {
        quizAddressStatus.textContent = getLocaleText("quizAddressError");
      }
    }

    function updateQuizStaticTexts() {
      if (quizAddressInput) {
        const placeholderKey = quizAddressInput.getAttribute("data-i18n-placeholder");
        if (placeholderKey) quizAddressInput.placeholder = getLocaleText(placeholderKey);
      }

      if (!quizQuestionWrap.hidden) {
        renderQuizQuestion();
      }

      if (!quizResults.hidden) {
        showQuizResults();
      }
    }

    quizAddressStart.addEventListener("click", startQuizFromAddress);
    quizAddressInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        startQuizFromAddress();
      }
    });

    document.addEventListener("languageChanged", updateQuizStaticTexts);
    updateQuizStaticTexts();
    restartQuizFlow();
  }

  const defaultLanguage = detectStartLanguage();

  if (languageSelect) {
    languageSelect.value = defaultLanguage;
    languageSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  }

  if (languageToggle && languageMenu && languageSelect) {
    function openLanguageMenu() {
      languageMenu.hidden = false;
      languageMenu.classList.add("is-open");
      languageToggle.setAttribute("aria-expanded", "true");
    }

    function closeLanguageMenu() {
      languageMenu.hidden = true;
      languageMenu.classList.remove("is-open");
      languageToggle.setAttribute("aria-expanded", "false");
    }

    closeLanguageMenu();

    languageToggle.addEventListener("click", () => {
      const isOpen = languageMenu.classList.contains("is-open");
      if (isOpen) {
        closeLanguageMenu();
      } else {
        openLanguageMenu();
      }
    });

    languageMenu.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const lang = target.getAttribute("data-language-option");
      if (!lang) return;

      languageSelect.value = lang;
      setLanguage(lang);
      closeLanguageMenu();
    });

    document.addEventListener("click", (event) => {
      if (!languageMenu || !languageToggle) return;
      if (!languageMenu.classList.contains("is-open")) return;
      if (event.target instanceof Node && (languageMenu.contains(event.target) || languageToggle.contains(event.target))) return;
      closeLanguageMenu();
    });
  }

  window.getLocaleText = getLocaleText;
  window.getCurrentLanguage = () => currentLanguage;
  window.setAppLanguage = setLanguage;

  setLanguage(defaultLanguage);

});
