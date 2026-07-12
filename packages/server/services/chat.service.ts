import fs from "fs/promises";
import path from "path";
import type { Response } from "express";
import {
  conversationRepository,
  type ConversationMessage,
} from "../repositories/conversation.repository";
import template from "../prompts/chatbox.txt";
import { logger } from "../lib/logger";

const OLLAMA_BASE_URL = (
  process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"
).replace(/\/$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.1";

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const OLLAMA_TEMPERATURE = toNumber(process.env.OLLAMA_TEMPERATURE, 0.2);
const OLLAMA_MAX_TOKENS = toNumber(process.env.OLLAMA_MAX_TOKENS, 256);
const OLLAMA_TIMEOUT_MS = toNumber(process.env.OLLAMA_TIMEOUT_MS, 30000);
const MAX_HISTORY_MESSAGES = toNumber(process.env.MAX_HISTORY_MESSAGES, 10);
const CACHE_TTL_MS = toNumber(process.env.CACHE_TTL_MS, 1000 * 60 * 60);

let instructionsPromise: Promise<string> | null = null;

interface OllamaStreamChunk {
  message?: {
    role?: string;
    content?: string;
  };
  done?: boolean;
  error?: string;
}

interface CacheEntry {
  response: string;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

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

const getCachedResponse = (prompt: string): string | undefined => {
  const entry = responseCache.get(getCacheKey(prompt));
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(getCacheKey(prompt));
    return undefined;
  }
  return entry.response;
};

const setCachedResponse = (prompt: string, response: string) => {
  responseCache.set(getCacheKey(prompt), {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

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

    const history = conversation.slice(-MAX_HISTORY_MESSAGES);

    const cached = getCachedResponse(prompt);
    if (cached && history.length === 0) {
      logger.info({ prompt, conversationId }, "Cache hit for prompt");
      sendSSE(res, { chunk: cached });
      sendSSE(res, { done: true });
      res.end();
      return;
    }

    const payload = buildPayload(instructions, history, prompt);

    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: payload,
        stream: true,
        options: {
          temperature: OLLAMA_TEMPERATURE,
          num_predict: OLLAMA_MAX_TOKENS,
        },
      }),
      signal: AbortSignal.timeout(OLLAMA_TIMEOUT_MS),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      const error = new Error(
        `Ollama request failed (${ollamaResponse.status} ${ollamaResponse.statusText}): ${errorText}`
      );
      logger.error(error, "Ollama request failed");
      throw error;
    }

    const reader = ollamaResponse.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let lineBuffer = "";

    if (!reader) {
      throw new Error("Ollama response body is empty");
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        lineBuffer += decoder.decode(value, { stream: true });
        const lines = lineBuffer.split("\n");
        lineBuffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          const data = JSON.parse(trimmed) as OllamaStreamChunk;
          const content = data.message?.content ?? "";
          if (content) {
            fullResponse += content;
            sendSSE(res, { chunk: content });
          }
        }
      }

      if (lineBuffer.trim()) {
        const data = JSON.parse(lineBuffer.trim()) as OllamaStreamChunk;
        const content = data.message?.content ?? "";
        if (content) {
          fullResponse += content;
          sendSSE(res, { chunk: content });
        }
      }
    } finally {
      reader.releaseLock();
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
      setCachedResponse(prompt, fullResponse.trim());
      logger.info({ prompt, conversationId }, "Cached response for prompt");
    }

    sendSSE(res, { done: true });
    res.end();
  },
};
