import { BotAvatar } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { NL } from "@/lib/locales/nl";
import type { ConnectionStatus } from "@/types/chat";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";

type ChatHeaderProps = {
  status: ConnectionStatus;
};

export const ChatHeader = ({ status }: ChatHeaderProps) => {
  return (
    <header className="glass-panel rounded-4xl border border-white/10 px-5 py-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            {SITE.name}
          </p>
          <div className="flex items-center gap-3">
            <BotAvatar size="md" className="backdrop-blur" />
            <div>
              <h1 className="text-glow text-2xl font-semibold leading-tight">
                {NL.chat.title}
              </h1>
              <p className="text-sm text-white/70">{NL.chat.subtitle}</p>
            </div>
          </div>
        </div>
        <ConnectionStatusBadge status={status} />
      </div>
    </header>
  );
};
