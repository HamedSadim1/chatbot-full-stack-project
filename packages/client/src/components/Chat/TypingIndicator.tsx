const TypingIndicator = () => {
  return (
    <div className="glass-panel inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.4em] text-white/60">
      AI typt
      <div className="flex items-center gap-1">
        <Dot />
        <Dot className="animation-delay-0.2s" />
        <Dot className="animation-delay-0.4s" />
      </div>
    </div>
  );
};

export default TypingIndicator;

type DotProps = {
  className?: string;
};

const Dot = ({ className }: DotProps) => (
  <div
    className={`h-2 w-2 rounded-full bg-gradient-to-r from-cyan-200 to-violet-200 opacity-80 animate-ping ${className}`}
  ></div>
);
