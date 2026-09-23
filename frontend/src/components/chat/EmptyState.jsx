import React from "react";
import { BrainCircuit, Sparkles, HelpCircle, FileCheck, FileSearch, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState({ onSelectPrompt }) {
  const starters = [
    {
      icon: Sparkles,
      title: "Executive Summary",
      desc: "Summarize the key highlights and main takeaways from this document.",
      prompt: "Can you provide a comprehensive executive summary of this document?",
    },
    {
      icon: FileSearch,
      title: "Key Data & Figures",
      desc: "Extract all crucial numbers, statistics, and metrics.",
      prompt: "Extract all key metrics, numbers, and dates mentioned in the document.",
    },
    {
      icon: FileCheck,
      title: "Action Items & Next Steps",
      desc: "Identify deliverables, deadlines, and responsibilities.",
      prompt: "What are the key action items and deliverables outlined in this document?",
    },
    {
      icon: HelpCircle,
      title: "Potential Risks & Red Flags",
      desc: "Surface any warnings, obligations, or potential liabilities.",
      prompt: "Are there any critical risks, limitations, or compliance requirements stated?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/30 ring-8 ring-blue-500/10">
          <BrainCircuit size={40} className="text-white animate-pulse" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
      >
        How can I help you today?
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md"
      >
        Select or upload a PDF document from the sidebar to query contextual information with verified source citations.
      </motion.p>

      {/* Suggested Starters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left"
      >
        {starters.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt?.(item.prompt)}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 text-left transition-all hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:shadow-md cursor-pointer"
            >
              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {item.title}
                  </h4>
                  <ArrowUpRight
                    size={14}
                    className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

export default EmptyState;