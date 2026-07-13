import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { NL } from "@/lib/locales/nl";

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
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    models.findIndex((model) => model.value === selected),
    0
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = "model-listbox";
  const selectedModel = models.find((model) => model.value === selected);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const openDropdown = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setActiveIndex((prev) =>
            prev < models.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && activeIndex >= 0) {
          handleSelect(models[activeIndex].value);
        } else if (!isOpen) {
          openDropdown();
        }
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(models.length - 1);
        break;
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const getOptionId = (index: number) => `model-option-${index}`;

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <button
        type="button"
        id="chat-model"
        onClick={() =>
          !disabled && (isOpen ? setIsOpen(false) : openDropdown())
        }
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-glass-border bg-glass-bg px-3 py-1.5 pr-8 text-sm text-text-secondary outline-none transition hover:bg-glass-bg-active focus:border-focus disabled:opacity-50"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-label={NL.chat.modelSelectorLabel}
      >
        <span className="truncate">{selectedModel?.label ?? selected}</span>
        <ChevronDown
          className={`pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          className="absolute left-0 top-full z-50 mt-2 min-w-full max-h-60 overflow-y-auto rounded-2xl border border-glass-border bg-glass-bg p-1.5 shadow-lg"
          role="listbox"
          aria-label={NL.chat.modelListLabel}
        >
          <ul className="flex flex-col gap-0.5">
            {models.map((model, index) => (
              <li key={model.value}>
                <button
                  type="button"
                  id={getOptionId(index)}
                  role="option"
                  aria-selected={model.value === selected}
                  onClick={() => handleSelect(model.value)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                    index === activeIndex
                      ? "bg-glass-bg-active text-text-primary"
                      : "text-text-secondary hover:bg-glass-bg-active hover:text-text-primary"
                  }`}
                >
                  <span>{model.label}</span>
                  {model.value === selected && (
                    <Check className="size-4 text-brand-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
