import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Shield, Cpu } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 mb-4 ring-8 ring-blue-500/10">
            <BrainCircuit size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Enterprise RAG
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Next-Gen Multi-Document Intelligence & Retrieval
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
              {subtitle && (
                <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
              )}
            </div>
          )}

          {children}
        </div>

        {/* Security & Feature Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield size={14} className="text-blue-500" /> AES-256 Auth
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu size={14} className="text-indigo-500" /> Chroma VectorDB
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-purple-500" /> Ollama RAG
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthLayout;

