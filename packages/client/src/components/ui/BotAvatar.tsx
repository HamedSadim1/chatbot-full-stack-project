import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type BotAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-10",
  md: "size-11",
  lg: "size-16",
};

const iconSizes = {
  sm: "size-5",
  md: "size-5",
  lg: "size-8",
};

export const BotAvatar = ({ size = "md", className }: BotAvatarProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-brand-bg shadow-[0_0_20px_var(--shadow-brand)] ring-1 ring-brand-ring",
        sizeClasses[size],
        className
      )}
    >
      <Bot className={cn("text-brand-primary", iconSizes[size])} />
    </span>
  );
};
