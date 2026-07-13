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
  size = "-- MB",
  uploaded = "Recently",
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={() => onSelect(document)}
      className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300
        ${
          selected
            ? "border-blue-500 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 shadow-lg shadow-blue-500/20"
            : "border-slate-700 bg-slate-800/80 hover:border-slate-500 hover:bg-slate-800"
        }`}
    >
      {/* Selected Border */}

      {selected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
      )}

      <div className="p-4">

        <div className="flex justify-between items-start">

          {/* Left */}

          <div className="flex gap-3">

            <div
              className={`rounded-xl p-3 ${
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

            <div>

              <h3 className="font-semibold text-white truncate max-w-[160px]">
                {document}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                PDF Document
              </p>

            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-2">

            {selected && (
              <CheckCircle2
                size={20}
                className="text-blue-400"
              />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document);
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

        {/* Footer */}

        <div className="mt-4 flex justify-between text-xs text-slate-400">

          <div className="flex items-center gap-1">
            <Calendar size={13} />
            {uploaded}
          </div>

          <div className="flex items-center gap-1">
            <HardDrive size={13} />
            {size}
          </div>

        </div>

      </div>
    </motion.div>
  );
}

export default DocumentCard;