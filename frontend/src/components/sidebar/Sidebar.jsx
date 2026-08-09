import { useEffect, useState } from "react";

import {
  Search,
  Files,
  RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/api";

import FileUpload from "./FileUpload";
import DocumentCard from "./DocumentCard";


function Sidebar({
  selectedDocument,
  setSelectedDocument,
}) {

  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(false);


  // --------------------------------
  // Load documents
  // --------------------------------

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const res = await api.get("/documents");

      setDocuments(
        res.data.documents || []
      );

    } catch (err) {

      console.error(
        "Load documents error:",
        err
      );

      toast.error(
        "Failed to load documents"
      );

    } finally {

      setLoading(false);

    }
  };


  // --------------------------------
  // Initial load
  // --------------------------------

  useEffect(() => {

    loadDocuments();

  }, []);


  // --------------------------------
  // Delete document
  // --------------------------------

  const deleteDocument = async (filename) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await api.delete(
        `/documents/${encodeURIComponent(filename)}`
      );

      toast.success(
        "Document deleted successfully"
      );

      // If deleted document was selected
      if (
        selectedDocument === filename
      ) {

        setSelectedDocument("");

      }

      // Reload documents
      await loadDocuments();

    } catch (err) {

      console.error(
        "Delete document error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Failed to delete document";

      toast.error(message);

    } finally {

      setDeleting(false);

    }
  };


  // --------------------------------
  // Search documents
  // --------------------------------

  const filteredDocuments =
    documents.filter((doc) => {

      const filename =
        doc?.filename || "";

      return filename
        .toLowerCase()
        .includes(
          search.toLowerCase()
        );

    });


  return (

    <aside className="h-full flex flex-col bg-slate-900 border-r border-slate-800 min-h-0">

      {/* ================= HEADER ================= */}

      <div className="flex-shrink-0 border-b border-slate-800">

        <div className="p-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-white">
                Documents
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Manage your knowledge base
              </p>

            </div>

            <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">

              {documents.length}

            </div>

          </div>

        </div>

      </div>


      {/* ================= SEARCH ================= */}

      <div className="flex-shrink-0 p-5 pb-3">

        <div className="flex items-center bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-3">

          <Search
            size={18}
            className="text-slate-400 flex-shrink-0"
          />

          <input
            type="text"
            className="ml-3 w-full bg-transparent outline-none text-white placeholder:text-slate-500"
            placeholder="Search PDFs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* ================= UPLOAD ================= */}

      <div className="flex-shrink-0 px-5 pb-4">

        <FileUpload
          onUpload={loadDocuments}
        />

      </div>


      {/* ================= DOCUMENT LIST HEADER ================= */}

      <div className="flex items-center justify-between px-5 pb-3">

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">

          {search
            ? `${filteredDocuments.length} results`
            : `${documents.length} documents`}

        </p>

        <button
          type="button"
          onClick={loadDocuments}
          disabled={loading || deleting}
          title="Refresh documents"
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50"
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

        </button>

      </div>


      {/* ================= DOCUMENTS ================= */}

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-3">

        {loading ? (

          <div className="flex flex-col items-center justify-center text-center mt-16">

            <RefreshCw
              size={28}
              className="text-blue-400 animate-spin mb-4"
            />

            <p className="text-slate-500">
              Loading documents...
            </p>

          </div>

        ) : filteredDocuments.length === 0 ? (

          <div className="flex flex-col items-center justify-center text-center mt-16 text-slate-500">

            <Files
              size={60}
              className="mb-4 opacity-40"
            />

            <h3 className="text-lg font-semibold text-slate-300">
              {search
                ? "No matching documents"
                : "No Documents"}
            </h3>

            <p className="text-sm mt-2">

              {search
                ? "Try a different search."
                : "Upload your first PDF to start chatting."}

            </p>

          </div>

        ) : (

          filteredDocuments.map((doc) => (

            <DocumentCard
              key={doc.filename}
              document={doc}
              selected={
                selectedDocument ===
                doc.filename
              }
              onSelect={
                setSelectedDocument
              }
              onDelete={
                deleteDocument
              }
            />

          ))

        )}

      </div>

    </aside>

  );
}

export default Sidebar;