import { ReactNode } from "react";

type CalloutType = "info" | "warning" | "success" | "error";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
}

const typeStyles: Record<CalloutType, string> = {
  info: "border-accent-blue bg-accent-blue/10",
  warning: "border-yellow-500 bg-yellow-500/10",
  success: "border-green-500 bg-green-500/10",
  error: "border-red-500 bg-red-500/10",
};

const typeIcons: Record<CalloutType, string> = {
  info: "ℹ️",
  warning: "⚠️",
  success: "✅",
  error: "❌",
};

export function Callout({ type = "info", children }: CalloutProps) {
  return (
    <div
      className={`my-4 p-4 rounded-lg border-l-4 ${typeStyles[type]}`}
      role="alert"
    >
      <div className="flex gap-2">
        <span className="text-xl" aria-hidden="true">
          {typeIcons[type]}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
