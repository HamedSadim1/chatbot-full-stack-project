import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export type Message = {
  role: "user" | "assistant";
  content: string;
};
interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const handleCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selectedText);
    }
  };
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const bubbleBase =
          "max-w-2xl rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-lg transition-all";
        const bubbleStyles = isUser
          ? "self-end bg-gradient-to-r from-cyan-400/90 via-sky-500/80 to-indigo-500/90 text-white shadow-[0_10px_40px_rgba(14,165,233,0.35)]"
          : "self-start glass-panel bg-white/8 text-slate-50 border border-white/10";

        return (
          <div className="flex flex-col gap-1" key={index}>
            <span
              className={`text-[11px] uppercase tracking-[0.4em] ${isUser ? "self-end text-white/70" : "text-white/50"}`}
            >
              {isUser ? "Jij" : "WonderWord"}
            </span>
            <div
              ref={index === messages.length - 1 ? lastMessageRef : null}
              onCopy={handleCopy}
              className={`${bubbleBase} ${bubbleStyles}`}
            >
              <div className="text-[0.95rem] leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
