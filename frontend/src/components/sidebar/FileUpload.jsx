import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../../api/api";

function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        res.data?.message ||
          "Document uploaded successfully"
      );

      setFile(null);

      if (onUpload) {
        await onUpload();
      }

      // Tell Navbar to refresh notification count
      window.dispatchEvent(
        new Event("notifications-updated")
      );

    } catch (err) {
      console.error(
        "Upload error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Upload failed. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">

      {/* Upload Area */}

      <motion.div
        whileHover={{
          scale: 1.01,
        }}
        whileTap={{
          scale: 0.995,
        }}
        {...getRootProps()}
        className={`
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          p-5
          text-center
          transition-all
          duration-200

          ${
            isDragActive
              ? `
                border-blue-500
                bg-blue-50
                dark:bg-blue-500/10
              `
              : `
                border-slate-300
                bg-slate-50
                hover:border-blue-400
                hover:bg-blue-50/60

                dark:border-slate-700
                dark:bg-slate-800/70
                dark:hover:border-blue-500
                dark:hover:bg-blue-500/10
              `
          }
        `}
      >

        <input {...getInputProps()} />

        <div className="flex flex-col items-center">

          <div
            className="
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600

              dark:bg-blue-500/15
              dark:text-blue-400
            "
          >
            <UploadCloud size={25} />
          </div>

          <h3
            className="
              font-semibold
              text-slate-800
              dark:text-white
            "
          >
            {isDragActive
              ? "Drop your PDF here"
              : "Upload a PDF"}
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            Drag and drop or click to browse
          </p>

        </div>

      </motion.div>

      {/* Selected File */}

      {file && (

        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-xl
            border
            border-blue-200
            bg-blue-50
            p-3

            dark:border-slate-700
            dark:bg-slate-800
          "
        >

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-100
                  text-red-500

                  dark:bg-red-500/10
                "
              >
                <FileText size={21} />
              </div>

              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-sm
                    font-medium
                    text-slate-800
                    dark:text-white
                  "
                >
                  {file.name}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setFile(null);
              }}
              className="
                shrink-0
                rounded-lg
                p-1.5
                text-slate-400
                transition
                hover:bg-red-100
                hover:text-red-500

                dark:hover:bg-red-500/10
              "
            >
              <X size={18} />
            </button>

          </div>

        </motion.div>

      )}

      {/* Upload Button */}

      <button
        type="button"
        disabled={loading || !file}
        onClick={uploadFile}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          py-3
          font-semibold
          text-white
          shadow-sm
          transition

          hover:bg-blue-700
          hover:shadow-lg

          disabled:cursor-not-allowed
          disabled:bg-slate-300
          disabled:text-slate-500

          dark:disabled:bg-slate-700
          dark:disabled:text-slate-400
        "
      >
        {loading ? (
          <>
            <RefreshIcon />
            Processing PDF...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Upload Document
          </>
        )}
      </button>

    </div>
  );
}

function RefreshIcon() {
  return (
    <div
      className="
        h-4
        w-4
        animate-spin
        rounded-full
        border-2
        border-white/30
        border-t-white
      "
    />
  );
}

export default FileUpload;