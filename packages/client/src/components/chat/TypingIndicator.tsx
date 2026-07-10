import { NL } from "@/lib/locales/nl";

const TypingIndicator = () => {
  return (
    <div
      className="inline-flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
      aria-label={NL.chat.typingAriaLabel}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-white/60">
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
    className="size-2 rounded-full bg-linear-to-r from-cyan-200 to-violet-200"
    style={{
      animation: "typing-bounce 1.2s ease-in-out infinite",
      animationDelay: delay,
    }}
  />
);
