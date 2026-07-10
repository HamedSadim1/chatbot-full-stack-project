import type { LucideIcon } from "lucide-react";
import { Wifi, WifiOff } from "lucide-react";
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
    color: "text-amber-300",
    bg: "bg-amber-400/20",
    label: NL.connection.checking,
    description: NL.connection.checkingDescription,
  },
  online: {
    icon: Wifi,
    color: "text-emerald-300",
    bg: "bg-emerald-400/20",
    label: NL.connection.online,
    description: NL.connection.onlineDescription,
  },
  offline: {
    icon: WifiOff,
    color: "text-red-300",
    bg: "bg-red-400/20",
    label: NL.connection.offline,
    description: NL.connection.offlineDescription,
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
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <div className="flex flex-col text-right text-xs text-white/70">
        <span className="font-semibold text-white">{currentStatus.label}</span>
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
