import React from "react";

export function StatusBadge({
  status = "neutral",
  children,
  dot = true,
  pulse = false,
  className = "",
}) {
  const styles = {
    success:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    danger:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    warning:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    info:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    neutral:
      "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const dotColors = {
    success: "bg-emerald-500",
    danger: "bg-rose-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        styles[status] || styles.neutral
      } ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                dotColors[status] || dotColors.neutral
              }`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              dotColors[status] || dotColors.neutral
            }`}
          />
        </span>
      )}
      {children}
    </span>
  );
}

export default StatusBadge;

