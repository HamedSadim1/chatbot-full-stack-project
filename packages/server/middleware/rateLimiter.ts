import rateLimit from "express-rate-limit";
import { logger } from "../lib/logger";
import { config } from "../config";

export const chatRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip, path: req.path }, "Rate limit exceeded");
    res.status(options.statusCode).json(options.message);
  },
});
