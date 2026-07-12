import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import { ErrorBanner } from "./ErrorBanner";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatFooter } from "./ChatFooter";
import { playAudioSafe, popAudio, notificationAudio } from "@/lib/audio";
import { apiClient } from "@/lib/api";
import { API, CHAT, TIMING } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type {
  ChatFormData,
  ChatResponse,
  ConnectionStatus,
  Message,
} from "@/types/chat";

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState<string>("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");

  const conversationId = useRef(crypto.randomUUID()).current;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const checkConnection = async () => {
      try {
        await apiClient.get(API.healthEndpoint, {
          timeout: TIMING.healthCheckTimeout,
        });
        if (!cancelled) setConnectionStatus("online");
      } catch {
        if (!cancelled) setConnectionStatus("offline");
      } finally {
        if (!cancelled) {
          timer = setTimeout(checkConnection, TIMING.healthCheckInterval);
        }
      }
    };

    void checkConnection();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, isAssistantTyping, error]);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: prompt, timestamp: new Date() },
      ]);
      setIsAssistantTyping(true);
      setError("");
      playAudioSafe(popAudio);

      const { data } = await apiClient.post<ChatResponse>(API.chatEndpoint, {
        prompt,
        conversationId,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, timestamp: new Date() },
      ]);
      playAudioSafe(notificationAudio);
    } catch (error) {
      console.error(error);
      setError(NL.chat.errorMessage);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  const handleRetry = () => {
    setError("");
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    if (lastUserMessage) {
      void onSubmit({ prompt: lastUserMessage.content });
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    void onSubmit({ prompt });
  };

  const showSuggestedPrompts =
    messages.length === 0 && !isAssistantTyping && !error;

  return (
    <div className="flex min-h-150 flex-col gap-6 text-white">
      <ChatHeader status={connectionStatus} />

      <section className="glass-panel flex flex-1 flex-col gap-4 rounded-4xl border border-white/10 p-4 sm:p-6">
        <div className="frosted-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
          <ChatMessages messages={messages} />

          {isAssistantTyping && <TypingIndicator />}
          {error && <ErrorBanner error={error} onRetry={handleRetry} />}

          {showSuggestedPrompts && (
            <SuggestedPrompts
              prompts={CHAT.suggestedPrompts}
              onSelect={handleSuggestedPrompt}
            />
          )}
          <div ref={scrollAnchorRef} className="h-px w-full shrink-0" />
        </div>
        <ChatFooter onSubmit={onSubmit} isLoading={isAssistantTyping} />
      </section>
    </div>
  );
};

export default ChatBot;
