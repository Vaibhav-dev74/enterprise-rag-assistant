import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PDFViewer({ selectedDocument }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  const pdfUrl = selectedDocument
    ? `http://localhost:8000/uploads/${selectedDocument}`
    : null;

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col">

      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white">
          PDF Preview
        </h2>
      </div>

      {!selectedDocument ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Select a document
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center p-3 bg-slate-800">

            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-30"
            >
              ◀
            </button>

            <span className="text-white">
              Page {page} / {numPages || "..."}
            </span>

            <button
              disabled={page >= numPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-30"
            >
              ▶
            </button>

          </div>

          <div className="overflow-auto flex-1 p-4">
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setPage(1);
              }}
            >
              <Page pageNumber={page} width={330} />
            </Document>
          </div>
        </>
      )}
    </div>
  );
}

export default PDFViewer;