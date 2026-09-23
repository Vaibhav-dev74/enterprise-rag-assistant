import React from "react";
import { motion } from "framer-motion";

export function Card({
  children,
  className = "",
  hover = false,
  glass = true,
  onClick,
  ...props
}) {
  const baseClasses = `
    rounded-2xl border transition-all duration-200
    ${
      glass
        ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-sm"
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
    }
    ${hover ? "hover:shadow-lg hover:border-blue-500/40 cursor-pointer" : ""}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export default Card;

