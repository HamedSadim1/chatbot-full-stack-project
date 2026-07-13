import { Sparkles, Zap } from "lucide-react";
import ChatInput from "./ChatInput";
import { SITE } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { ChatFormData } from "@/types/chat";

type ChatFooterProps = {
  onSubmit: (data: ChatFormData) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
};

export const ChatFooter = ({
  onSubmit,
  isLoading,
  disabled,
  selectedModel,
  onModelChange,
}: ChatFooterProps) => {
  return (
    <div className="pt-1">
      <ChatInput
        onSubmit={onSubmit}
        isLoading={isLoading}
        disabled={disabled}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
      <p className="mt-2 flex items-center gap-2 text-xs text-text-muted">
        <Sparkles className="size-3.5 text-brand-primary" />
        {SITE.botName} {NL.chat.footerNote}
        <Zap className="ml-auto size-3.5 text-warning" />
        <span className="text-text-muted/70">{NL.chat.footerTagline}</span>
      </p>
    </div>
  );
};
