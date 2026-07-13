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
          className="rounded-full border border-glass-border bg-glass-bg px-4 py-2 text-sm text-text-secondary transition hover:border-brand-primary/50 hover:bg-glass-bg-active hover:text-text-primary"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
