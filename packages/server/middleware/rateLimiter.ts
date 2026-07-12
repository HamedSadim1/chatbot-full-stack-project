import rateLimit from "express-rate-limit";
import { logger } from "../lib/logger";

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
  keyGenerator: (req) => (req.ip ? String(req.ip) : "unknown"),
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip, path: req.path }, "Rate limit exceeded");
    res.status(options.statusCode).json(options.message);
  },
});
