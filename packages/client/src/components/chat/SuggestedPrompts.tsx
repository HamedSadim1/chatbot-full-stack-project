type SuggestedPromptsProps = {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
};

export const SuggestedPrompts = ({
  prompts,
  onSelect,
}: SuggestedPromptsProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-glass-border bg-glass-bg/80 px-4 py-2 text-sm text-text-secondary shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary/50 hover:bg-glass-bg-active hover:text-text-primary hover:shadow-md"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
