import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import z from "zod";

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long (max 1000 characters)"),
  conversationId: z
    .string()
    .regex(/^(\w{8})-(\w{4})-(\w{4})-(\w{4})-(\w{12})$/),
});
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.format });
    }

    try {
      const { prompt, conversationId } = parseResult.data;
      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
