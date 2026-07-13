import type { Request, Response } from "express";
import z from "zod";
import { chatService } from "../services/chat.service";
import { logger } from "../lib/logger";

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long (max 1000 characters)"),
  conversationId: z.string().uuid(),
  model: z.string().min(1).optional(),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.format() });
    }

    const { prompt, conversationId, model } = parseResult.data;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await chatService.sendMessage(prompt, conversationId, res, model);
    } catch (error) {
      logger.error(error, "Chat request failed");
      res.write(
        `data: ${JSON.stringify({
          error: "Internal Server Error",
          details: error instanceof Error ? error.message : "Unknown error",
        })}\n\n`
      );
      res.end();
    }
  },
};
