import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import { chatRateLimiter } from "./middleware/rateLimiter";
import { correlationIdMiddleware } from "./middleware/correlationId";
import { logger } from "./lib/logger";
import { config } from "./config";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "10kb" }));
app.use(correlationIdMiddleware);
app.use("/api/chat", chatRateLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: duration,
        userAgent: req.get("user-agent"),
      },
      "request completed"
    );
  });
  next();
});

app.use(router);

app.listen(config.port, () => {
  logger.info({ port: config.port }, "Server started");
});
