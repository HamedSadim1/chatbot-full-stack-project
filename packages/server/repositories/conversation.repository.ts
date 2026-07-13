import { LRUCache } from "lru-cache";
import { config } from "../config";

export type ConversationMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface ConversationRepository {
  getMessages(conversationId: string): ConversationMessage[];
  setMessages(conversationId: string, messages: ConversationMessage[]): void;
  reset(conversationId: string): void;
}

class InMemoryConversationRepository implements ConversationRepository {
  private conversations = new LRUCache<string, ConversationMessage[]>({
    max: config.chat.maxConversations,
  });

  getMessages(conversationId: string): ConversationMessage[] {
    return this.conversations.get(conversationId) ?? [];
  }

  setMessages(conversationId: string, messages: ConversationMessage[]) {
    const trimmed = messages.slice(-config.chat.maxStoredMessages);
    this.conversations.set(conversationId, trimmed);
  }

  reset(conversationId: string) {
    this.conversations.delete(conversationId);
  }
}

export const conversationRepository: ConversationRepository =
  new InMemoryConversationRepository();
