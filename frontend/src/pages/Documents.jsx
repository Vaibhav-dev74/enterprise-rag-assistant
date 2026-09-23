import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  Trash2,
  Eye,
  MessageSquare,
  Calendar,
  HardDrive,
  RefreshCw,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import api from "../api/api";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Card } from "../components/ui/Card";

export function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Documents");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Delete Modal
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/documents");
      setDocuments(res.data?.documents || []);
    } catch (err) {
      console.error("Fetch docs error:", err);
      toast.error("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    const handleUpdate = () => fetchDocuments();
    window.addEventListener("documents-updated", handleUpdate);
    return () => window.removeEventListener("documents-updated", handleUpdate);
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data?.message || "Document uploaded and indexed!");
      fetchDocuments();
      window.dispatchEvent(new Event("documents-updated"));
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.detail || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleOpenPreview = async (filename) => {
    try {
      setPreviewDoc(filename);
      setPreviewLoading(true);
      const res = await api.get(`/documents/${encodeURIComponent(filename)}`);
      setPreviewData(res.data);
    } catch (err) {
      toast.error("Could not load preview.");
      setPreviewDoc(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/documents/${encodeURIComponent(docToDelete)}`);
      setDocuments((prev) => prev.filter((d) => d.filename !== docToDelete));
      setDocToDelete(null);
      toast.success("Document deleted from storage and vector database.");
      window.dispatchEvent(new Event("documents-updated"));
    } catch (err) {
      toast.error("Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const startChatWithDoc = (filename) => {
    navigate(`/dashboard?doc=${encodeURIComponent(filename)}`);
  };

  const filteredDocs = documents.filter((d) =>
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  const totalStorageMb = documents
    .reduce((acc, d) => acc + (d.size_mb || 0), 0)
    .toFixed(2);

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col">
      <Navbar onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)} />

      <div className="flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block h-full w-[220px] shrink-0 border-r border-slate-200 dark:border-slate-800 xl:w-[240px]">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        <div className="lg:hidden">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </div>

        {/* MAIN DOCUMENT REPOSITORY */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                  <FileText size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Document Repository
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {documents.length} PDF{documents.length === 1 ? "" : "s"} indexed &bull; {totalStorageMb} MB total
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDocuments}
                  disabled={loading}
                  icon={RefreshCw}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              {...getRootProps()}
              className={`relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                isDragActive
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]"
                  : "border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-blue-400 dark:hover:border-blue-500"
              }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
                <UploadCloud size={32} className={uploading ? "animate-bounce" : ""} />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                {uploading
                  ? "Ingesting & Chunking PDF..."
                  : isDragActive
                  ? "Drop PDF to Index"
                  : "Drag & drop your PDF file here, or browse"}
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Documents are automatically vectorized and stored in ChromaDB for fast retrieval.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search uploaded documents by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-44 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center">
                <FileText size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                  No documents found
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {search
                    ? "Try adjusting your search query."
                    : "Upload your first PDF document to begin asking questions."}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredDocs.map((doc) => (
                    <motion.div
                      key={doc.filename}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 hover:border-blue-500/50 hover:shadow-xl transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="rounded-xl bg-red-500/10 p-3 text-red-500">
                            <FileText size={22} />
                          </div>
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() => handleOpenPreview(doc.filename)}
                              title="Preview Document"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDocToDelete(doc.filename)}
                              title="Delete Document"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <h3
                          title={doc.filename}
                          className="truncate font-bold text-slate-900 dark:text-white text-sm"
                        >
                          {doc.filename}
                        </h3>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                          <span className="flex items-center gap-1">
                            <HardDrive size={13} /> {doc.size_mb} MB
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => startChatWithDoc(doc.filename)}
                          icon={MessageSquare}
                          className="w-full text-xs"
                        >
                          Chat with Doc
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* PREVIEW MODAL */}
      <Modal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc || "Document Preview"}
        maxWidth="max-w-2xl"
      >
        {previewLoading ? (
          <div className="py-12 text-center text-sm text-slate-400 animate-pulse">
            Loading preview from PDF pages...
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span>Pages: <strong>{previewData?.pages || 0}</strong></span>
              <span>Size: <strong>{previewData?.size_mb || 0} MB</strong></span>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Page 1 Excerpt
              </h5>
              <div className="max-h-60 overflow-y-auto rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {previewData?.preview || "No preview text available."}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const name = previewDoc;
                  setPreviewDoc(null);
                  startChatWithDoc(name);
                }}
                icon={MessageSquare}
              >
                Open in Chat
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        title="Delete Document?"
        description={`Are you sure you want to permanently delete "${docToDelete}"? All vectorized embeddings will be purged from ChromaDB.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={() => setDocToDelete(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={deleting}
            onClick={handleDelete}
            icon={Trash2}
          >
            Delete Document
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Documents;

