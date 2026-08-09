import {
  FileText,
  Trash2,
  CheckCircle2,
  Calendar,
  HardDrive,
} from "lucide-react";

import { motion } from "framer-motion";

function DocumentCard({
  document,
  selected,
  onSelect,
  onDelete,
}) {
  // --------------------------------
  // Format date
  // --------------------------------

  const formatDate = (date) => {
    if (!date) return "Recently";

    const uploadDate = new Date(date);

    if (Number.isNaN(uploadDate.getTime())) {
      return "Recently";
    }

    return uploadDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------
  // Format file size
  // --------------------------------

  const formatSize = () => {
    if (!document?.size_bytes) {
      return "0 KB";
    }

    const size = document.size_bytes;

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filename = document?.filename || "Unknown PDF";

  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        y: -1,
      }}
      whileTap={{
        scale: 0.99,
      }}
      onClick={() => onSelect(filename)}
      className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
        selected
          ? "border-blue-500 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 shadow-lg shadow-blue-500/20"
          : "border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800"
      }`}
    >
      {/* Selected indicator */}

      {selected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
      )}

      <div className="p-4">

        {/* ================= TOP ================= */}

        <div className="flex justify-between items-start">

          {/* File information */}

          <div className="flex gap-3 min-w-0">

            <div
              className={`flex-shrink-0 rounded-xl p-3 ${
                selected
                  ? "bg-blue-500/20"
                  : "bg-red-500/10"
              }`}
            >
              <FileText
                size={24}
                className={
                  selected
                    ? "text-blue-400"
                    : "text-red-400"
                }
              />
            </div>

            <div className="min-w-0">

              <h3
                title={filename}
                className="font-semibold text-white truncate max-w-[180px]"
              >
                {filename}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                PDF Document
              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="flex items-center gap-1 flex-shrink-0">

            {selected && (
              <CheckCircle2
                size={19}
                className="text-blue-400"
              />
            )}

            <button
              type="button"
              title="Delete document"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(filename);
              }}
              className="opacity-0 group-hover:opacity-100 transition rounded-lg p-2 hover:bg-red-500/20"
            >
              <Trash2
                size={18}
                className="text-slate-400 hover:text-red-400"
              />
            </button>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">

          <div className="flex items-center gap-1">

            <Calendar size={13} />

            <span>
              {formatDate(document?.uploaded_at)}
            </span>

          </div>

          <div className="flex items-center gap-1">

            <HardDrive size={13} />

            <span>
              {formatSize()}
            </span>

          </div>

        </div>

      </div>

    </motion.div>
  );
}

export default DocumentCard;