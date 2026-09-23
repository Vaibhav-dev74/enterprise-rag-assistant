import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, FileText, BrainCircuit, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export function Message({
  role,
  text,
  sources,
  setSelectedDocument,
  setSelectedPage,
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`group mb-6 flex items-start gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md ${
          isUser
            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
            : "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700"
        }`}
      >
        {isUser ? <User size={18} /> : <BrainCircuit size={19} />}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-2xl rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/10 rounded-tr-none"
            : "border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-sm rounded-tl-none"
        }`}
      >
        {/* Copy Button (only for assistant or hover) */}
        {!isUser && text && (
          <button
            type="button"
            onClick={handleCopy}
            title="Copy message"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}

        {/* Source Citations */}
        {!isUser && sources?.length > 0 && (
          <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <FileText size={13} className="text-blue-500" />
              Verified Document Citations ({sources.length})
            </h4>

            <div className="grid gap-2 sm:grid-cols-2">
              {sources.map((source, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (source.filename) setSelectedDocument?.(source.filename);
                    if (source.page) setSelectedPage?.(source.page);
                  }}
                  className="flex flex-col items-start rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-3 text-left transition hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                      {source.filename}
                    </span>
                    <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      P. {source.page}
                    </span>
                  </div>

                  {source.text && (
                    <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      "{source.text}"
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Message;