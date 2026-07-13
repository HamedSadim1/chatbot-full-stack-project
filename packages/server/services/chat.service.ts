import fs from "fs/promises";
import path from "path";
import { LRUCache } from "lru-cache";
import type { Response } from "express";
import {
  conversationRepository,
  type ConversationMessage,
} from "../repositories/conversation.repository";
import template from "../prompts/chatbox.txt";
import { logger } from "../lib/logger";
import { config } from "../config";

let instructionsPromise: Promise<string> | null = null;

interface OllamaResponse {
  message?: {
    role?: string;
    content?: string;
  };
  done?: boolean;
  error?: string;
}

const responseCache = new LRUCache<string, string>({
  max: config.chat.maxCacheEntries,
  ttl: config.chat.cacheTtlMs,
  updateAgeOnGet: true,
});

const buildInstructions = async (): Promise<string> => {
  const parkInfo = await fs.readFile(
    path.join(__dirname, "..", "prompts", "WonderWord.md"),
    "utf-8"
  );
  return template.replace("{{parkInfo}}", parkInfo);
};

const getInstructions = (): Promise<string> => {
  if (!instructionsPromise) {
    instructionsPromise = buildInstructions();
  }
  return instructionsPromise;
};

const getCacheKey = (prompt: string) => prompt.trim().toLowerCase();

const sendSSE = (res: Response, data: unknown) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
  (res as Response & { flush?: () => void }).flush?.();
};

const buildPayload = (
  instructions: string,
  history: ConversationMessage[],
  prompt: string
): ConversationMessage[] => [
  { role: "system", content: instructions },
  ...history,
  { role: "user", content: prompt },
];

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string,
    res: Response
  ): Promise<void> {
    const instructions = await getInstructions();
    const conversation = conversationRepository.getMessages(conversationId);

    const history = conversation.slice(-config.chat.maxHistoryMessages);

    const cached = responseCache.get(getCacheKey(prompt));
    if (cached && history.length === 0) {
      logger.info({ prompt, conversationId }, "Cache hit for prompt");
      sendSSE(res, { chunk: cached });
      sendSSE(res, { done: true });
      res.end();
      return;
    }

    const payload = buildPayload(instructions, history, prompt);

    const ollamaBody = {
      model: config.ollama.model,
      messages: payload,
      stream: false,
      options: {
        temperature: config.ollama.temperature,
        num_predict: config.ollama.maxTokens,
      },
    };

    let ollamaResponse: globalThis.Response;
    try {
      ollamaResponse = await fetch(`${config.ollama.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ollamaBody),
        signal: AbortSignal.timeout(config.ollama.timeoutMs),
      });
    } catch (error) {
      const isTimeout =
        (error instanceof DOMException && error.name === "TimeoutError") ||
        (error instanceof Error && error.name === "TimeoutError");
      const message = isTimeout
        ? `Ollama timed out after ${config.ollama.timeoutMs}ms at ${config.ollama.baseUrl}. Make sure Ollama is running and the model "${config.ollama.model}" is available.`
        : `Failed to connect to Ollama at ${config.ollama.baseUrl}. Make sure Ollama is running.`;
      logger.error({ error, baseUrl: config.ollama.baseUrl }, message);
      throw new Error(message);
    }

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      const error = new Error(
        `Ollama request failed (${ollamaResponse.status} ${ollamaResponse.statusText}): ${errorText}`
      );
      logger.error(error, "Ollama request failed");
      throw error;
    }

    let fullResponse = "";
    try {
      const data = (await ollamaResponse.json()) as OllamaResponse;
      const content = data.message?.content ?? "";
      fullResponse = content;
      if (content) {
        sendSSE(res, { chunk: content });
      }
    } catch (parseError) {
      logger.warn({ parseError }, "Failed to parse Ollama response");
      sendSSE(res, { error: "Failed to parse Ollama response" });
      res.end();
      return;
    }

    const assistantMessage: ConversationMessage = {
      role: "assistant",
      content: fullResponse.trim(),
    };

    conversationRepository.setMessages(conversationId, [
      ...history,
      { role: "user", content: prompt },
      assistantMessage,
    ]);

    if (fullResponse.trim() && history.length === 0) {
      responseCache.set(getCacheKey(prompt), fullResponse.trim());
      logger.info({ prompt, conversationId }, "Cached response for prompt");
    }

    sendSSE(res, { done: true });
    res.end();
  },
};
