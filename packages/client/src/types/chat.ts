export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

export type ChatFormData = {
  prompt: string;
};

export type ChatResponse = {
  message: string;
};

export type ConnectionStatus = "checking" | "online" | "offline";
