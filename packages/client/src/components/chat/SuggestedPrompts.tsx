type SuggestedPromptsProps = {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
};

export const SuggestedPrompts = ({
  prompts,
  onSelect,
}: SuggestedPromptsProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-400/50 hover:bg-white/10 hover:text-white"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
