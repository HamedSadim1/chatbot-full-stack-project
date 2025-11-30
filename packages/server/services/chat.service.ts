import fs from "fs";
import path from "path";
import {
  conversationRepository,
  type ConversationMessage,
} from "../repositories/conversation.repository";
import template from "../prompts/chatbox.txt";

const parkInfo = fs.readFileSync(
  path.join(__dirname, "..", "prompts", "WonderWord.md"),
  "utf-8"
);

const instructions = template.replace("{{parkInfo}}", parkInfo);

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

interface OllamaChatResponse {
  message: {
    role: "assistant";
    content: string;
  };
  done: boolean;
}

interface ChatResponse {
  message: string;
}
export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const conversation = conversationRepository.getMessages(conversationId);
    const hasSystem = conversation.some((msg) => msg.role === "system");

    const history: ConversationMessage[] = hasSystem
      ? [...conversation]
      : [{ role: "system", content: instructions }, ...conversation];

    const payload: ConversationMessage[] = [
      ...history,
      { role: "user", content: prompt },
    ];

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: payload,
        stream: false,
        options: {
          temperature: OLLAMA_TEMPERATURE,
          num_predict: OLLAMA_MAX_TOKENS,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ollama request failed (${response.status} ${response.statusText}): ${errorText}`
      );
    }

    const data = (await response.json()) as OllamaChatResponse;

    if (!data?.message?.content) {
      throw new Error("Ollama response did not contain a message");
    }

    const assistantMessage: ConversationMessage = {
      role: "assistant",
      content: data.message.content.trim(),
    };

    conversationRepository.setMessages(conversationId, [
      ...payload,
      assistantMessage,
    ]);

    return { message: assistantMessage.content };
  },
};
