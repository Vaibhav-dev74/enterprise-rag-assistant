import React, { useState, useEffect } from "react";
import { FileText, Calendar, HardDrive, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../api/api";

export function RecentDocument({ limit = 5, onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      setDocuments(res.data?.documents?.slice(0, limit) || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    const handleUpdate = () => fetchDocs();
    window.addEventListener("documents-updated", handleUpdate);
    return () => window.removeEventListener("documents-updated", handleUpdate);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center">
        <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No documents uploaded
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF documents to start querying them with AI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {documents.map((doc, index) => (
        <motion.div
          key={doc.filename}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectDocument?.(doc.filename)}
          className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-3.5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-red-500/10 p-2 text-red-500 shrink-0">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {doc.filename}
              </h4>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <HardDrive size={12} />
                  {doc.size_mb} MB
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(doc.uploaded_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <ArrowRight
            size={16}
            className="text-slate-400 group-hover:translate-x-0.5 transition shrink-0"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default RecentDocument;

