import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

export function Loader({
  size = "md",
  text = "Loading...",
  fullscreen = false,
  className = "",
}) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-12 w-12 rounded-full border-2 border-blue-500/20 border-t-blue-600 dark:border-blue-400/20 dark:border-t-blue-400"
        />
        <BrainCircuit className="absolute h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export default Loader;

