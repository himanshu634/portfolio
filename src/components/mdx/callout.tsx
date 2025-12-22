import { ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "error";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const typeStyles: Record<CalloutType, string> = {
  info: "border-accent-2 bg-accent-2/10 text-foreground",
  warning: "border-accent-2 bg-accent-2/10 text-foreground",
  success: "border-accent-1 bg-accent-1/10 text-foreground",
  error: "border-accent-2 bg-accent-2/20 text-foreground",
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
      className={`my-4 p-4 rounded-lg border-l-4 ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex gap-2">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
