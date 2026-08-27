import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Files,
  RefreshCw,
  FileText,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/api";

import FileUpload from "./FileUpload";
import DocumentCard from "./DocumentCard";

function Sidebar({
  selectedDocument,
  setSelectedDocument,
}) {

  const [documents, setDocuments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  const loadDocuments = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/documents");

      setDocuments(
        res.data?.documents || []
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

 useEffect(() => {

  loadDocuments();

  const refreshDocuments = () => {

    loadDocuments();

  };

  window.addEventListener(
    "documents-updated",
    refreshDocuments
  );

  return () => {

    window.removeEventListener(
      "documents-updated",
      refreshDocuments
    );

  };

}, []);
  const deleteDocument = async (
    filename
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${filename}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await api.delete(
        `/documents/${encodeURIComponent(
          filename
        )}`
      );

      toast.success(
        "Document deleted successfully"
      );

      if (
        selectedDocument === filename
      ) {
        setSelectedDocument("");
      }

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

    <aside
      className="
        flex
        h-full
        min-h-0
        flex-col
        border-r
        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900
      "
    >

      {/* HEADER */}

      <div
        className="
          shrink-0
          border-b
          border-slate-200
          px-5
          pb-4
          pt-5

          dark:border-slate-800
        "
      >

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-100
                  text-blue-600

                  dark:bg-blue-500/10
                  dark:text-blue-400
                "
              >
                <FileText size={19} />
              </div>

              <div>

                <h2
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Documents
                </h2>

              </div>

            </div>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Upload and manage your knowledge base
            </p>

          </div>

          <div
            className="
              mt-1
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-full
              bg-blue-100
              px-2
              text-sm
              font-semibold
              text-blue-700

              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            {documents.length}
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="shrink-0 px-5 pt-4">

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            py-3
            transition

            focus-within:border-blue-400
            focus-within:ring-2
            focus-within:ring-blue-500/10

            dark:border-slate-700
            dark:bg-slate-800
          "
        >

          <Search
            size={18}
            className="
              shrink-0
              text-slate-400
            "
          />

          <input
            type="text"
            className="
              min-w-0
              w-full
              bg-transparent
              text-sm
              text-slate-800
              outline-none
              placeholder:text-slate-400

              dark:text-white
              dark:placeholder:text-slate-500
            "
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* UPLOAD */}

      <div className="shrink-0 px-5 py-4">

        <FileUpload
          onUpload={loadDocuments}
        />

      </div>

      {/* LIST HEADER */}

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          px-5
          pb-3
        "
      >

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
              dark:text-slate-500
            "
          >
            {search
              ? `${filteredDocuments.length} Results`
              : `${documents.length} Documents`}
          </p>

        </div>

        <button
          type="button"
          onClick={loadDocuments}
          disabled={
            loading || deleting
          }
          title="Refresh documents"
          className="
            rounded-lg
            p-2
            text-slate-400
            transition

            hover:bg-slate-100
            hover:text-blue-600

            disabled:cursor-not-allowed
            disabled:opacity-50

            dark:hover:bg-slate-800
            dark:hover:text-blue-400
          "
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

        </button>

      </div>

      {/* DOCUMENT LIST */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-5
          pb-5
          space-y-3
        "
      >

        {loading ? (

          <div
            className="
              mt-16
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <RefreshCw
              size={28}
              className="
                mb-3
                animate-spin
                text-blue-500
              "
            />

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Loading documents...
            </p>

          </div>

        ) : filteredDocuments.length === 0 ? (

          <div
            className="
              mt-12
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div
              className="
                mb-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-slate-100

                dark:bg-slate-800
              "
            >

              <Files
                size={30}
                className="
                  text-slate-400
                "
              />

            </div>

            <h3
              className="
                text-base
                font-semibold
                text-slate-700
                dark:text-slate-300
              "
            >
              {search
                ? "No matching documents"
                : "No documents yet"}
            </h3>

            <p
              className="
                mt-2
                max-w-[230px]
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {search
                ? "Try searching with a different name."
                : "Upload your first PDF to start asking questions."}
            </p>

          </div>

        ) : (

          filteredDocuments.map(
            (doc) => (

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

            )
          )

        )}

      </div>

    </aside>
  );
}

export default Sidebar;