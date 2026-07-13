import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
  models: readonly { value: string; label: string }[];
  selected: string;
  onSelect: (model: string) => void;
  disabled?: boolean;
}

export const ModelSelector = ({
  models,
  selected,
  onSelect,
  disabled = false,
}: ModelSelectorProps) => {
  return (
    <div className="relative">
      <select
        id="chat-model"
        name="model"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="appearance-none rounded-full border border-glass-border bg-glass-bg px-3 py-1.5 pr-8 text-sm text-text-secondary outline-none transition hover:bg-glass-bg-active focus:border-brand-primary/50 disabled:opacity-50"
      >
        {models.map((model) => (
          <option key={model.value} value={model.value} className="bg-surface">
            {model.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
    </div>
  );
};
