import React from "react";
import { BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-600/10 p-1.5 text-blue-600 dark:text-blue-400">
            <BrainCircuit size={16} />
          </div>
          <span className="font-semibold text-slate-800 dark:text-white">
            Enterprise RAG
          </span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={14} />
            <span>Secure ChromaDB Vectorstore</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Sparkles size={14} />
            <span>Hybrid RAG + Ollama Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

