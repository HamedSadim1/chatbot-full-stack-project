import axios from "axios";
import { useRef, useState } from "react";
import { Bot, Sparkles, Wifi } from "lucide-react";
import ChatInput, { type ChatFormData } from "./ChatInput";
import type { Message } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import popSound from "@/assets/sounds/pop.mp3";
import notificationSound from "@/assets/sounds/notification.mp3";

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  const [error, setError] = useState<string>("");

  const conversationId = useRef(crypto.randomUUID()).current;
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
    /\/$/,
    ""
  );

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);
      setIsAssistantTyping(true);
      console.log(prompt);
      setError("");
      popAudio.play();

      const { data } = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
        prompt,
        conversationId,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      notificationAudio.play();
    } catch (error) {
      console.error(error);
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
    } finally {
      setIsAssistantTyping(false);
    }
  };

  return (
    <div className="flex min-h-[600px] flex-col gap-6 text-white">
      <header className="glass-panel rounded-[32px] border border-white/10 px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              WonderChat
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <Bot className="size-5 text-cyan-200" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold leading-tight text-glow">
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
              <span className="font-semibold text-white">Live status</span>
              <span>Realtime verbinding actief</span>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/30">
              <Wifi className="size-4 text-emerald-200" />
            </span>
          </div>
        </div>
      </header>

      <section className="glass-panel flex flex-1 flex-col gap-4 rounded-[32px] border border-white/10 p-4 sm:p-6">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2 frosted-scrollbar">
          <ChatMessages messages={messages} />

          {isAssistantTyping && <TypingIndicator />}
          {error && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-50">
              {error}
            </div>
          )}
        </div>
        <div className="pt-1">
          <ChatInput onSubmit={onSubmit} />
          <p className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <Sparkles className="size-3.5 text-cyan-200" />
            WonderWord gebruikt contextuele prompts voor persoonlijkere
            antwoorden.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ChatBot;
