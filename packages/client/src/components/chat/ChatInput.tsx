import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui";
import { ModelSelector } from "./ModelSelector";
import { CHAT, TIMING } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { ChatFormData } from "@/types/chat";

type Props = {
  onSubmit: (data: ChatFormData) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
};

const ChatInput = ({
  onSubmit,
  isLoading = false,
  disabled = false,
  selectedModel = CHAT.defaultModel,
  onModelChange,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    clearErrors,
    control,
  } = useForm<ChatFormData>({
    mode: "onChange",
    defaultValues: { prompt: "", model: selectedModel },
  });

  const promptValue = useWatch({ control, name: "prompt", defaultValue: "" });
  const characterCount = promptValue.length;

  const { ref, ...rest } = register("prompt", {
    required: NL.validation.required,
    minLength: {
      value: CHAT.minLength,
      message: NL.validation.minLength(CHAT.minLength),
    },
    maxLength: {
      value: CHAT.maxLength,
      message: NL.validation.maxLength(CHAT.maxLength),
    },
    validate: (value) =>
      value.trim().length > 0 || NL.validation.notOnlyWhitespace,
  });

  const handleFormSubmit = handleSubmit(async (data: ChatFormData) => {
    if (isLoading) return;
    reset({ prompt: "", model: selectedModel });
    await onSubmit(data);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleFormSubmit();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, TIMING.textareaMaxHeight)}px`;
  }, [promptValue]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const isValid =
    !formState.errors.prompt &&
    promptValue.trim().length >= CHAT.minLength &&
    !isLoading;

  return (
    <form
      onSubmit={handleFormSubmit}
      className="group relative flex flex-col gap-2 rounded-28 border border-glass-border bg-glass-bg px-4 py-3 shadow-lg backdrop-blur-2xl transition focus-within:border-brand-primary/50 focus-within:bg-glass-bg-active focus-within:shadow-[0_0_40px_rgba(14,165,233,0.2)]"
      aria-label={NL.chat.inputAriaLabel}
    >
      <textarea
        {...rest}
        id="chat-prompt"
        name="prompt"
        ref={(element) => {
          ref(element);
          textareaRef.current = element;
        }}
        className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-text-primary placeholder-text-muted focus:outline-none focus:ring-0 disabled:opacity-60"
        placeholder={NL.chat.placeholder}
        maxLength={CHAT.maxLength}
        minLength={CHAT.minLength}
        rows={1}
        disabled={isLoading || disabled}
        aria-invalid={formState.errors.prompt ? "true" : "false"}
        onChange={(e) => {
          setValue("prompt", e.target.value, { shouldValidate: true });
          clearErrors("prompt");
        }}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-h-5 items-center gap-2">
          <ModelSelector
            models={CHAT.models}
            selected={selectedModel}
            onSelect={(model) => {
              onModelChange?.(model);
              setValue("model", model);
            }}
            disabled={disabled}
          />
          {formState.errors.prompt ? (
            <span className="text-xs text-error">
              {formState.errors.prompt.message}
            </span>
          ) : (
            <span
              className={`text-xs transition-colors ${
                characterCount >=
                CHAT.maxLength * TIMING.characterWarningThreshold
                  ? "text-warning"
                  : "text-text-muted"
              }`}
            >
              {characterCount}/{CHAT.maxLength}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid || disabled}
          aria-label={NL.chat.sendAriaLabel}
          className="h-10 w-10 rounded-full bg-linear-to-r from-brand-primary to-brand-secondary text-button-text shadow-[0_10px_30px_rgba(14,165,233,0.45)] transition-all hover:scale-105 hover:shadow-[0_10px_40px_rgba(14,165,233,0.55)] disabled:opacity-40 disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ArrowUp className="size-5" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
