export type ConversationMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

// In productie hoort deze state in een gedeelde datastore zoals Redis of PostgreSQL
const conversations = new Map<string, ConversationMessage[]>();

export const conversationRepository = {
  getMessages(conversationId: string): ConversationMessage[] {
    return conversations.get(conversationId) ?? [];
  },
  setMessages(conversationId: string, messages: ConversationMessage[]) {
    conversations.set(conversationId, messages);
  },
  reset(conversationId: string) {
    conversations.delete(conversationId);
  },
};
