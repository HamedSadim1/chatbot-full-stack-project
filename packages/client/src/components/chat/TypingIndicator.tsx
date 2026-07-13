import { NL } from "@/lib/locales/nl";

const TypingIndicator = () => {
  return (
    <div
      className="inline-flex items-center gap-3 self-start rounded-2xl border border-glass-border bg-glass-bg/80 px-4 py-3 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300"
      aria-label={NL.chat.typingAriaLabel}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {NL.chat.typingLabel}
      </span>
      <div className="flex items-center gap-1.5">
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  );
};

export default TypingIndicator;

type DotProps = {
  delay: string;
};

const Dot = ({ delay }: DotProps) => (
  <div
    className="size-2 rounded-full bg-brand-primary"
    style={{
      animation: "typing-bounce 1.2s ease-in-out infinite",
      animationDelay: delay,
    }}
  />
);
