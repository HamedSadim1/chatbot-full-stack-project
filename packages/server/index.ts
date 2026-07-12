import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import { chatRateLimiter } from "./middleware/rateLimiter";
import { logger } from "./lib/logger";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10kb" }));
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server started");
});
