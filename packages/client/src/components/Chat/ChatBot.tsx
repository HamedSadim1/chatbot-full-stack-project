import { useEffect, useRef, useState } from "react";
import { RefreshCw, Sparkles, Wifi, WifiOff, Zap } from "lucide-react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { playAudioSafe, popAudio, notificationAudio } from "@/lib/audio";
import { apiClient } from "@/lib/api";
import { API, CHAT, SITE } from "@/lib/constants";
import type {
  ChatFormData,
  ChatResponse,
  ConnectionStatus,
  Message,
} from "@/types/chat";

const SUGGESTED_PROMPTS = CHAT.suggestedPrompts;

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [error, setError] = useState<string>("");
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("checking");

  const conversationId = useRef(crypto.randomUUID()).current;

  useEffect(() => {
    let cancelled = false;

    const checkConnection = async () => {
      try {
        await apiClient.get(API.healthEndpoint, { timeout: 5000 });
        if (!cancelled) setConnectionStatus("online");
      } catch {
        if (!cancelled) setConnectionStatus("offline");
      }
    };

    void checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
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

  const statusConfig = {
    checking: {
      icon: Wifi,
      color: "text-amber-300",
      bg: "bg-amber-400/20",
      label: "Controleren...",
      description: "Verbinding wordt gecontroleerd",
    },
    online: {
      icon: Wifi,
      color: "text-emerald-300",
      bg: "bg-emerald-400/20",
      label: "Online",
      description: "Realtime verbinding actief",
    },
    offline: {
      icon: WifiOff,
      color: "text-red-300",
      bg: "bg-red-400/20",
      label: "Offline",
      description: "Geen verbinding met server",
    },
  };

  const currentStatus = statusConfig[connectionStatus];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex min-h-150 flex-col gap-6 text-white">
      <header className="glass-panel rounded-4xl border border-white/10 px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              {SITE.name}
            </p>
            <div className="flex items-center gap-3">
              <BotAvatar size="md" className="backdrop-blur" />
              <div>
                <h1 className="text-glow text-2xl font-semibold leading-tight">
                  Altijd klaar om te helpen
                </h1>
                <p className="text-sm text-white/70">
                  Vraag me alles en ik antwoord met flair.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div className="flex flex-col text-right text-xs text-white/70">
              <span className="font-semibold text-white">
                {currentStatus.label}
              </span>
              <span>{currentStatus.description}</span>
            </div>
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${currentStatus.bg}`}
            >
              <StatusIcon className={`size-4 ${currentStatus.color}`} />
            </span>
          </div>
        </div>
      </header>

      <section className="glass-panel flex flex-1 flex-col gap-4 rounded-4xl border border-white/10 p-4 sm:p-6">
        <div className="frosted-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
          <ChatMessages messages={messages} />

          {isAssistantTyping && <TypingIndicator />}
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-50 animate-in fade-in slide-in-from-bottom-2">
              <span>{error}</span>
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500/30 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-500/40"
              >
                <RefreshCw className="size-3.5" />
                Opnieuw proberen
              </button>
            </div>
          )}

          {messages.length === 0 && !isAssistantTyping && !error && (
            <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="pt-1">
          <ChatInput onSubmit={onSubmit} isLoading={isAssistantTyping} />
          <p className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <Sparkles className="size-3.5 text-cyan-200" />
            {SITE.botName} gebruikt contextuele prompts voor persoonlijkere
            antwoorden.
            <Zap className="ml-auto size-3.5 text-amber-300" />
            <span className="text-white/40">Snel & persoonlijk</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default ChatBot;
