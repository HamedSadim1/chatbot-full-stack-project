import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { CHAT, TIMING } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { ChatFormData } from "@/types/chat";

type Props = {
  onSubmit: (data: ChatFormData) => Promise<void>;
  isLoading?: boolean;
};

const ChatInput = ({ onSubmit, isLoading = false }: Props) => {
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
    defaultValues: { prompt: "" },
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
    reset({ prompt: "" });
    await onSubmit(data);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
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

  const isValid =
    !formState.errors.prompt &&
    promptValue.trim().length >= CHAT.minLength &&
    !isLoading;

  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
      className="group relative flex flex-col gap-2 rounded-28 border border-white/10 bg-white/5 px-4 py-3 shadow-lg backdrop-blur-2xl transition focus-within:border-cyan-400/50 focus-within:bg-white/8 focus-within:shadow-[0_0_40px_rgba(14,165,233,0.2)]"
      aria-label={NL.chat.inputAriaLabel}
    >
      <textarea
        {...rest}
        ref={(element) => {
          ref(element);
          textareaRef.current = element;
        }}
        className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-white placeholder-white/50 focus:outline-none focus:ring-0 disabled:opacity-60"
        placeholder={NL.chat.placeholder}
        maxLength={CHAT.maxLength}
        minLength={CHAT.minLength}
        autoFocus
        rows={1}
        disabled={isLoading}
        aria-invalid={formState.errors.prompt ? "true" : "false"}
        onChange={(e) => {
          setValue("prompt", e.target.value, { shouldValidate: true });
          clearErrors("prompt");
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-h-5 items-center gap-2">
          {formState.errors.prompt ? (
            <span className="text-xs text-red-300">
              {formState.errors.prompt.message}
            </span>
          ) : (
            <span
              className={`text-xs transition-colors ${
                characterCount >=
                CHAT.maxLength * TIMING.characterWarningThreshold
                  ? "text-amber-300"
                  : "text-white/40"
              }`}
            >
              {characterCount}/{CHAT.maxLength}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid}
          aria-label={NL.chat.sendAriaLabel}
          className="h-10 w-10 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_10px_30px_rgba(14,165,233,0.45)] transition-all hover:scale-105 hover:shadow-[0_10px_40px_rgba(14,165,233,0.55)] disabled:opacity-40 disabled:hover:scale-100"
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
