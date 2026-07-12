import z from "zod";

const normalizeBaseUrl = (url: string): string => url.replace(/\/$/, "");

const preprocessNumber = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (value === undefined || value === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, schema);

const configSchema = z.object({
  port: preprocessNumber(z.number().int().positive().default(3000)),
  nodeEnv: z.enum(["development", "production", "test"]).default("development"),

  ollama: z.object({
    baseUrl: z
      .string()
      .url()
      .default("http://127.0.0.1:11434")
      .transform(normalizeBaseUrl),
    model: z.string().default("llama3.1"),
    temperature: preprocessNumber(z.number().default(0.2)),
    maxTokens: preprocessNumber(z.number().int().positive().default(256)),
    timeoutMs: preprocessNumber(z.number().int().positive().default(30000)),
  }),

  chat: z.object({
    maxHistoryMessages: preprocessNumber(
      z.number().int().positive().default(10)
    ),
    maxStoredMessages: preprocessNumber(
      z.number().int().positive().default(50)
    ),
    maxConversations: preprocessNumber(
      z.number().int().positive().default(1000)
    ),
    cacheTtlMs: preprocessNumber(
      z
        .number()
        .int()
        .positive()
        .default(1000 * 60 * 60)
    ),
    maxCacheEntries: preprocessNumber(
      z.number().int().positive().default(1000)
    ),
  }),

  rateLimit: z.object({
    windowMs: preprocessNumber(
      z
        .number()
        .int()
        .positive()
        .default(60 * 1000)
    ),
    max: preprocessNumber(z.number().int().positive().default(20)),
  }),

  logging: z.object({
    level: z
      .enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
      .default("info"),
    pretty: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  }),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,

  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL,
    model: process.env.OLLAMA_MODEL,
    temperature: process.env.OLLAMA_TEMPERATURE,
    maxTokens: process.env.OLLAMA_MAX_TOKENS,
    timeoutMs: process.env.OLLAMA_TIMEOUT_MS,
  },

  chat: {
    maxHistoryMessages: process.env.MAX_HISTORY_MESSAGES,
    maxStoredMessages: process.env.MAX_STORED_MESSAGES,
    maxConversations: process.env.MAX_CONVERSATIONS,
    cacheTtlMs: process.env.CACHE_TTL_MS,
    maxCacheEntries: process.env.MAX_CACHE_ENTRIES,
  },

  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS,
    max: process.env.RATE_LIMIT_MAX,
  },

  logging: {
    level: process.env.LOG_LEVEL,
    pretty: process.env.LOG_PRETTY,
  },
});
