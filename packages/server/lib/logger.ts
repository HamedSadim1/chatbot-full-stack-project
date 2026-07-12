import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const isPrettyEnabled = isDevelopment || process.env.LOG_PRETTY === "true";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport: isPrettyEnabled
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});
