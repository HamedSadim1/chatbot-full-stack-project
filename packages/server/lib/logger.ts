import { AsyncLocalStorage } from "async_hooks";
import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const isPrettyEnabled = isDevelopment || process.env.LOG_PRETTY === "true";

const correlationIdStorage = new AsyncLocalStorage<string>();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  mixin: () => {
    const correlationId = correlationIdStorage.getStore();
    return correlationId ? { correlationId } : {};
  },
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

export const runWithCorrelationId = <T>(
  correlationId: string,
  fn: () => T
): T => {
  return correlationIdStorage.run(correlationId, fn);
};
