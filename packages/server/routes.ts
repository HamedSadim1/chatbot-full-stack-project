import express, { type Request, type Response } from "express";
import { chatController } from "./controllers/chat.controller";
import { logger } from "./lib/logger";

const OLLAMA_BASE_URL = (
  process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"
).replace(/\/$/, "");

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server");
});

router.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the API" });
});

router.get("/api/health", async (req: Request, res: Response) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!response.ok) throw new Error("Ollama health check failed");
    res.json({ status: "UP", ollama: "reachable" });
  } catch (error) {
    logger.error(error, "Health check failed");
    res.status(503).json({
      status: "DOWN",
      ollama: "unreachable",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/api/chat", chatController.sendMessage);

export default router;
