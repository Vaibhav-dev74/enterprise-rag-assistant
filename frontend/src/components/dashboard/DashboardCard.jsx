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
  const filename =
    typeof document === "string"
      ? document
      : document?.filename;

  const uploaded =
    document?.uploaded || "Recently";

  const size =
    document?.size || "--";

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
      className={`
        group
        relative
        overflow-hidden
        rounded-xl
        border
        cursor-pointer
        transition-all
        duration-200
        ${
          selected
            ? `
              border-blue-500
              bg-blue-50
              dark:bg-blue-500/15
              shadow-lg
              shadow-blue-500/10
            `
            : `
              border-slate-200
              bg-white
              hover:border-slate-300
              hover:bg-slate-50
              dark:border-slate-700
              dark:bg-slate-800/80
              dark:hover:border-slate-600
              dark:hover:bg-slate-800
            `
        }
      `}
    >
      {selected && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
      )}

      <div className="p-4">

        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 gap-3">

            <div
              className={`
                shrink-0
                rounded-xl
                p-3
                ${
                  selected
                    ? "bg-blue-500/15"
                    : "bg-red-500/10"
                }
              `}
            >
              <FileText
                size={22}
                className={
                  selected
                    ? "text-blue-500"
                    : "text-red-500"
                }
              />
            </div>

            <div className="min-w-0">

              <h3
                title={filename}
                className="
                  truncate
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {filename}
              </h3>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                PDF Document
              </p>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-1">

            {selected && (
              <CheckCircle2
                size={20}
                className="text-blue-500"
              />
            )}

            <button
              type="button"
              title="Delete document"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(filename);
              }}
              className="
                rounded-lg
                p-2
                text-slate-400
                opacity-100
                transition
                hover:bg-red-500/10
                hover:text-red-500
                sm:opacity-0
                sm:group-hover:opacity-100
              "
            >
              <Trash2 size={17} />
            </button>

          </div>

        </div>

        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">

          <div className="flex min-w-0 items-center gap-1">
            <Calendar size={13} />
            <span className="truncate">
              {uploaded}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <HardDrive size={13} />
            {size}
          </div>

        </div>

      </div>

    </motion.div>
  );
}

export default DocumentCard;