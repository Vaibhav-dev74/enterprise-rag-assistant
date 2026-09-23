import React from "react";
import { motion } from "framer-motion";

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  onClick,
  className = "",
}) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-500/40",
      gradient: "from-blue-600 to-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-500/40",
      gradient: "from-emerald-600 to-teal-600",
    },
    purple: {
      bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-500/40",
      gradient: "from-purple-600 to-pink-600",
    },
    amber: {
      bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-500/40",
      gradient: "from-amber-600 to-orange-600",
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 shadow-sm
        transition-all duration-200 ${currentTheme.border} ${
        onClick ? "cursor-pointer" : ""
      } ${className}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`rounded-2xl p-3.5 sm:p-4 ${currentTheme.bg}`}>
            <Icon size={26} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.gradient} opacity-80`}
      />
    </motion.div>
  );
}

export default DashboardCard;