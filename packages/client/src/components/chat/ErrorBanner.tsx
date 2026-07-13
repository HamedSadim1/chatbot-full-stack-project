import { RefreshCw } from "lucide-react";
import { NL } from "@/lib/locales/nl";

type ErrorBannerProps = {
  error: string;
  onRetry: () => void;
};

export const ErrorBanner = ({ error, onRetry }: ErrorBannerProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-error-border bg-error-surface px-4 py-3 text-sm text-error-foreground animate-in fade-in slide-in-from-bottom-2">
      <span>{error}</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-error-button px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-error-hover"
      >
        <RefreshCw className="size-3.5" />
        {NL.chat.retryLabel}
      </button>
    </div>
  );
};
