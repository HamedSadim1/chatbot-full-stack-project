import { AsyncLocalStorage } from "async_hooks";
import pino from "pino";
import { config } from "../config";

const isPrettyEnabled =
  config.nodeEnv === "development" || config.logging.pretty;

const correlationIdStorage = new AsyncLocalStorage<string>();

export const logger = pino({
  level: config.logging.level,
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
