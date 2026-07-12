export type ConversationMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface ConversationRepository {
  getMessages(conversationId: string): ConversationMessage[];
  setMessages(conversationId: string, messages: ConversationMessage[]): void;
  reset(conversationId: string): void;
}

const MAX_STORED_MESSAGES = 50;

class InMemoryConversationRepository implements ConversationRepository {
  private conversations = new Map<string, ConversationMessage[]>();

  getMessages(conversationId: string): ConversationMessage[] {
    return this.conversations.get(conversationId) ?? [];
  }

  setMessages(conversationId: string, messages: ConversationMessage[]) {
    const trimmed = messages.slice(-MAX_STORED_MESSAGES);
    this.conversations.set(conversationId, trimmed);
  }

  reset(conversationId: string) {
    this.conversations.delete(conversationId);
  }
}

export const conversationRepository: ConversationRepository =
  new InMemoryConversationRepository();
