export const SITE = {
  name: "WonderChat",
  botName: "WonderWord",
  author: "Hamed Sadim",
  portfolioUrl: "https://hamedsadim-portfolio.vercel.app",
  githubUrl: "https://github.com/HamedSadim1",
} as const;

export const API = {
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, ""),
  healthEndpoint: "/hello",
  chatEndpoint: "/chat",
} as const;

export const CHAT = {
  minLength: 5,
  maxLength: 1000,
  suggestedPrompts: [
    "Wat kun je allemaal doen?",
    "Vertel me iets interessants over AI.",
    "Help me met een creatief idee.",
  ],
} as const;

export const AUDIO = {
  popVolume: 0.2,
  notificationVolume: 0.2,
} as const;
