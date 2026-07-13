import type { LucideIcon } from "lucide-react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { NL } from "@/lib/locales/nl";
import type { ConnectionStatus } from "@/types/chat";

type StatusConfig = {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  description: string;
};

const statusConfig: Record<ConnectionStatus, StatusConfig> = {
  checking: {
    icon: Wifi,
    color: "text-warning",
    bg: "bg-warning/20",
    label: NL.connection.checking,
    description: NL.connection.checkingDescription,
  },
  online: {
    icon: Wifi,
    color: "text-success",
    bg: "bg-success/20",
    label: NL.connection.online,
    description: NL.connection.onlineDescription,
  },
  offline: {
    icon: WifiOff,
    color: "text-error",
    bg: "bg-error/20",
    label: NL.connection.offline,
    description: NL.connection.offlineDescription,
  },
  "ollama-offline": {
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/20",
    label: NL.connection.ollamaOffline,
    description: NL.connection.ollamaOfflineDescription,
  },
};

type ConnectionStatusBadgeProps = {
  status: ConnectionStatus;
};

export const ConnectionStatusBadge = ({
  status,
}: ConnectionStatusBadgeProps) => {
  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-glass-border bg-glass-bg px-4 py-3 backdrop-blur">
      <div className="flex flex-col text-right text-xs text-text-muted">
        <span className="font-semibold text-text-primary">
          {currentStatus.label}
        </span>
        <span>{currentStatus.description}</span>
      </div>
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${currentStatus.bg}`}
      >
        <StatusIcon className={`size-4 ${currentStatus.color}`} />
      </span>
    </div>
  );
};
