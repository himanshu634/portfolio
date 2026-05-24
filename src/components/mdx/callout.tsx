import { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "error";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const typeStyles: Record<CalloutType, string> = {
  info: "bg-border/30 text-foreground",
  warning: "bg-border/30 text-foreground",
  success: "bg-border/20 text-foreground",
  error: "bg-border/40 text-foreground",
};

const typeIcons: Record<
  CalloutType,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

export function Callout({ type = "info", children }: CalloutProps) {
  const Icon = typeIcons[type];

  return (
    <div
      className={`my-4 p-4 rounded-lg ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex gap-2">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
