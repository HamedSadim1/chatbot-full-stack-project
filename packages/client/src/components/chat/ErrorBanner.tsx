import { RefreshCw } from "lucide-react";
import { NL } from "@/lib/locales/nl";

type ErrorBannerProps = {
  error: string;
  onRetry: () => void;
};

export const ErrorBanner = ({ error, onRetry }: ErrorBannerProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-error/40 bg-error/20 px-4 py-3 text-sm text-error-foreground animate-in fade-in slide-in-from-bottom-2">
      <span>{error}</span>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-error/30 px-3 py-1.5 text-xs font-medium text-text-primary transition hover:bg-error/40"
      >
        <RefreshCw className="size-3.5" />
        {NL.chat.retryLabel}
      </button>
    </div>
  );
};
