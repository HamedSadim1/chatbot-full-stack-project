import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, User } from "lucide-react";
import { BotAvatar } from "@/components/ui";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { APP, SITE, TIMING } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
}

const formatTime = (date?: Date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat(APP.locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

interface AssistantMessageContentProps {
  content: string;
  animate: boolean;
}

const AssistantMessageContent = ({
  content,
  animate,
}: AssistantMessageContentProps) => {
  const displayedContent = useTypingEffect(content, {
    speed: 12,
    enabled: animate,
  });

  return <ReactMarkdown>{displayedContent}</ReactMarkdown>;
};

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), TIMING.copiedFeedbackDuration);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <BotAvatar size="lg" className="backdrop-blur" />
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-semibold text-text-primary">
            {NL.chat.welcomeTitle} {SITE.name}
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            {NL.chat.welcomeDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const messageKey = `${msg.timestamp?.getTime() ?? index}-${index}`;

        return (
          <div
            key={messageKey}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-2 duration-300 will-change-transform`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-2xl backdrop-blur ${
                isUser
                  ? "bg-linear-to-br from-brand-primary to-brand-secondary text-button-text"
                  : "bg-glass-bg text-brand-primary"
              }`}
              aria-hidden="true"
            >
              {isUser ? <User className="size-4" /> : <BotAvatar size="sm" />}
            </div>

            <div
              className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {isUser ? NL.chat.userLabel : SITE.botName}
                </span>
                <span className="text-[10px] text-text-muted/70">
                  {formatTime(msg.timestamp)}
                </span>
              </div>

              <div
                className={`group relative max-w-2xl rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg transition-all ${
                  isUser
                    ? "bg-linear-to-r from-brand-primary/90 via-brand-secondary/80 to-brand-tertiary/90 text-text-primary shadow-[0_10px_40px_var(--shadow-brand)]"
                    : "glass-panel border-glass-border bg-glass-bg text-text-secondary"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:rounded-2xl prose-pre:bg-surface/80 prose-pre:p-4 prose-code:rounded-md prose-code:bg-surface/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-brand-primary prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
                  {isUser ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <AssistantMessageContent
                      key={`assistant-${index}-${msg.timestamp?.getTime() ?? index}-${msg.content.length}`}
                      content={msg.content}
                      animate={!isUser && index === messages.length - 1}
                    />
                  )}
                </div>

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.content, index)}
                    className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-glass-border bg-surface/80 text-text-primary/70 opacity-0 shadow-lg backdrop-blur transition hover:bg-surface-hover hover:text-text-primary group-hover:opacity-100"
                    aria-label={NL.chat.copyLabel}
                    title={NL.chat.copyLabel}
                  >
                    {copiedIndex === index ? (
                      <Check className="size-3.5 text-success" />
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
