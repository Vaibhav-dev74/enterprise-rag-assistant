import { useEffect, useState } from "react";
import { Search, Files } from "lucide-react";
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

  // ----------------------------
  // Load Documents
  // ----------------------------

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/documents");

      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // ----------------------------
  // Delete Document
  // ----------------------------

  const deleteDocument = async (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;

    try {
      await api.delete(`/documents/${filename}`);

      toast.success("Document deleted");

      if (selectedDocument === filename) {
        setSelectedDocument("");
      }

      loadDocuments();

    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ----------------------------
  // Search
  // ----------------------------

  const filtered = documents.filter((doc) =>
    doc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* ================= HEADER ================= */}

      <div className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800">

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

      <div className="p-5">

        <div className="flex items-center bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-3">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            className="ml-3 w-full bg-transparent outline-none text-white placeholder:text-slate-500"
            placeholder="Search PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* ================= UPLOAD ================= */}

      <div className="px-5 pb-5">
        <FileUpload onUpload={loadDocuments} />
      </div>

      {/* ================= DOCUMENTS ================= */}

      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-3">

        {loading ? (

          <div className="text-center text-slate-500 mt-12">
            Loading documents...
          </div>

        ) : filtered.length === 0 ? (

          <div className="flex flex-col items-center justify-center text-center mt-16 text-slate-500">

            <Files
              size={60}
              className="mb-4 opacity-40"
            />

            <h3 className="text-lg font-semibold text-slate-300">
              No Documents
            </h3>

            <p className="text-sm mt-2">
              Upload your first PDF to start chatting.
            </p>

          </div>

        ) : (

          filtered.map((doc) => (

            <DocumentCard
              key={doc}
              document={doc}
              selected={selectedDocument === doc}
              onSelect={setSelectedDocument}
              onDelete={deleteDocument}

              // Placeholder metadata
              uploaded="Today"
              size="2.3 MB"
            />

          ))

        )}

      </div>

    </aside>
  );
}

export default Sidebar;