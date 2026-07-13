import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X } from "lucide-react";
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  const uploadFile = async () => {
    if (!file) {
      toast.error("Select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);

      setFile(null);

      if (onUpload) onUpload();

    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">

      <motion.div
        whileHover={{ scale: 1.01 }}
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-all
        ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-700 bg-slate-800 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center text-center">

          <UploadCloud
            size={42}
            className="text-blue-400 mb-3"
          />

          <h3 className="text-white font-semibold">

            {isDragActive
              ? "Drop PDF here"
              : "Drag & Drop PDF"}

          </h3>

          <p className="text-slate-400 text-sm mt-2">

            or click to browse

          </p>

        </div>

      </motion.div>

      {file && (

        <motion.div
          layout
          className="rounded-xl bg-slate-800 border border-slate-700 p-4"
        >

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-3">

              <FileText
                className="text-red-400"
                size={24}
              />

              <div>

                <p className="text-white text-sm font-medium">
                  {file.name}
                </p>

                <p className="text-slate-400 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={() => setFile(null)}
            >
              <X
                className="text-slate-400 hover:text-red-400"
              />
            </button>

          </div>

        </motion.div>

      )}

      <button
        disabled={loading || !file}
        onClick={uploadFile}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 transition"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

    </div>
  );
}

export default FileUpload;