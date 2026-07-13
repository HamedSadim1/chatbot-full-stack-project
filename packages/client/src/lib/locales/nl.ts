export const NL = {
  app: {
    tagline: "Chat & AI assistent",
    madeBy: "Gemaakt door",
    portfolioLabel: "Portfolio",
    githubLabel: "GitHub",
  },
  chat: {
    title: "Altijd klaar om te helpen",
    subtitle: "Vraag me alles en ik antwoord met flair.",
    placeholder: "Vertel me je idee of vraag...",
    sendAriaLabel: "Verstuur bericht",
    inputAriaLabel: "Chat invoer",
    typingLabel: "AI typt",
    typingAriaLabel: "AI is aan het typen",
    userLabel: "Jij",
    welcomeTitle: "Welkom bij",
    welcomeDescription:
      "Stel een vraag of deel een idee. Ik ben hier om je te helpen met heldere, persoonlijke antwoorden.",
    footerNote: "gebruikt contextuele prompts voor persoonlijkere antwoorden.",
    footerTagline: "Snel & persoonlijk",
    errorMessage: "Er is een fout opgetreden. Probeer het later opnieuw.",
    ollamaTimeoutError:
      "De AI-service (Ollama) reageert niet. Start Ollama en zorg dat het juiste model beschikbaar is.",
    ollamaConnectionError:
      "Kan geen verbinding maken met Ollama. Controleer of Ollama is gestart.",
    retryLabel: "Opnieuw proberen",
    copyLabel: "Kopieer bericht",
    modelSelectorLabel: "Selecteer model",
    modelListLabel: "Beschikbare modellen",
  },
  validation: {
    required: "Typ eerst een bericht.",
    notOnlyWhitespace: "Bericht mag niet alleen spaties bevatten.",
    minLength: (min: number) => `Bericht moet minimaal ${min} tekens bevatten.`,
    maxLength: (max: number) => `Bericht mag maximaal ${max} tekens bevatten.`,
  },
  connection: {
    checking: "Controleren...",
    checkingDescription: "Verbinding wordt gecontroleerd",
    online: "Online",
    onlineDescription: "Realtime verbinding actief",
    offline: "Offline",
    offlineDescription: "Geen verbinding met server",
    ollamaOffline: "Ollama offline",
    ollamaOfflineDescription: "AI-service niet bereikbaar",
  },
} as const;
