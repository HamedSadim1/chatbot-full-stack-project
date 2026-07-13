import { AsyncLocalStorage } from "async_hooks";
import path from "path";
import pino from "pino";
import { config } from "../config";

const isPrettyEnabled =
  config.nodeEnv === "development" || config.logging.pretty;

const correlationIdStorage = new AsyncLocalStorage<string>();

const logFilePath = path.join(
  process.cwd(),
  "logs",
  `server-${process.pid}.log`
);

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      level: config.logging.level,
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
    {
      target: "pino/file",
      level: config.logging.level,
      options: {
        destination: logFilePath,
        mkdir: true,
      },
    },
  ],
});

export const logger = pino(
  {
    level: config.logging.level,
    mixin: () => {
      const correlationId = correlationIdStorage.getStore();
      return correlationId ? { correlationId } : {};
    },
  },
  isPrettyEnabled
    ? transport
    : pino.transport({
        target: "pino/file",
        options: { destination: logFilePath, mkdir: true },
      })
);

export const runWithCorrelationId = <T>(
  correlationId: string,
  fn: () => T
): T => {
  return correlationIdStorage.run(correlationId, fn);
};
