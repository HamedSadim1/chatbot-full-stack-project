import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, User } from "lucide-react";
import { BotAvatar } from "@/components/ui/BotAvatar";
import { SITE } from "@/lib/constants";
import type { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
}

const formatTime = (date?: Date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <BotAvatar size="lg" className="backdrop-blur" />
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Welkom bij {SITE.name}
          </h2>
          <p className="text-sm leading-relaxed text-white/60">
            Stel een vraag of deel een idee. Ik ben hier om je te helpen met
            heldere, persoonlijke antwoorden.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const isLast = index === messages.length - 1;

        return (
          <div
            key={index}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-2xl backdrop-blur ${
                isUser
                  ? "bg-linear-to-br from-cyan-400 to-blue-500 text-slate-950"
                  : "bg-white/10 text-cyan-200"
              }`}
              aria-hidden="true"
            >
              {isUser ? <User className="size-4" /> : <BotAvatar size="sm" />}
            </div>

            <div
              className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                  {isUser ? "Jij" : SITE.botName}
                </span>
                <span className="text-[10px] text-white/40">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              <div
                ref={isLast ? lastMessageRef : null}
                className={`group relative max-w-2xl rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg transition-all ${
                  isUser
                    ? "bg-linear-to-r from-cyan-400/90 via-sky-500/80 to-indigo-500/90 text-white shadow-[0_10px_40px_rgba(14,165,233,0.35)]"
                    : "glass-panel border border-white/10 bg-white/8 text-slate-50"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:rounded-2xl prose-pre:bg-slate-950/80 prose-pre:p-4 prose-code:rounded-md prose-code:bg-slate-950/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-200 prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, index)}
                    className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 text-white/70 opacity-0 shadow-lg backdrop-blur transition hover:bg-slate-800 hover:text-white group-hover:opacity-100"
                    aria-label="Kopieer bericht"
                    title="Kopieer bericht"
                  >
                    {copiedIndex === index ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
