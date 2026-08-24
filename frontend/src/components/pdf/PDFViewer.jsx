import {
  useState,
  useEffect,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

function PDFViewer({
  selectedDocument,
  selectedPage,
  setSelectedPage,
}) {
  const [numPages, setNumPages] =
    useState(null);

  const [viewerWidth, setViewerWidth] =
    useState(330);

  useEffect(() => {

    const updateWidth = () => {

      const width =
        window.innerWidth;

      if (width < 500) {
        setViewerWidth(
          Math.max(260, width - 40)
        );
      } else if (width < 900) {
        setViewerWidth(360);
      } else {
        setViewerWidth(330);
      }
    };

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateWidth
      );
    };

  }, []);

  useEffect(() => {

    setNumPages(null);

    if (
      numPages &&
      selectedPage > numPages
    ) {
      setSelectedPage(1);
    }

  }, [selectedDocument]);

  const pdfUrl =
    selectedDocument
      ? `http://127.0.0.1:8000/uploads/${encodeURIComponent(
          selectedDocument
        )}`
      : null;

  return (
    <section
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        bg-white
        dark:bg-slate-900
      "
    >

      {/* HEADER */}

      <div
        className="
          shrink-0
          border-b
          border-slate-200
          p-4
          dark:border-slate-800
        "
      >

        <div className="flex items-center gap-2">

          <FileText
            size={21}
            className="text-blue-500"
          />

          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            PDF Preview
          </h2>

        </div>

      </div>

      {!selectedDocument ? (

        <div
          className="
            flex
            min-h-0
            flex-1
            flex-col
            items-center
            justify-center
            px-5
            text-center
            text-slate-500
          "
        >

          <FileText
            size={50}
            className="mb-4 opacity-40"
          />

          <p>
            Select a document
          </p>

        </div>

      ) : (

        <>

          {/* PAGE CONTROLS */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              gap-3
              border-b
              border-slate-200
              bg-slate-50
              p-3
              dark:border-slate-800
              dark:bg-slate-800
            "
          >

            <button
              type="button"
              disabled={
                selectedPage <= 1
              }
              onClick={() =>
                setSelectedPage(
                  (page) => page - 1
                )
              }
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                p-2
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-30
                dark:border-slate-700
                dark:bg-slate-700
                dark:text-white
                dark:hover:bg-slate-600
              "
            >
              <ChevronLeft size={18} />
            </button>

            <span
              className="
                truncate
                text-sm
                font-medium
                text-slate-700
                dark:text-white
              "
            >
              Page {selectedPage} /{" "}
              {numPages || "..."}
            </span>

            <button
              type="button"
              disabled={
                !numPages ||
                selectedPage >= numPages
              }
              onClick={() =>
                setSelectedPage(
                  (page) => page + 1
                )
              }
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                p-2
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-30
                dark:border-slate-700
                dark:bg-slate-700
                dark:text-white
                dark:hover:bg-slate-600
              "
            >
              <ChevronRight size={18} />
            </button>

          </div>

          {/* PDF */}

          <div
            className="
              min-h-0
              flex-1
              overflow-auto
              bg-slate-100
              p-3
              dark:bg-slate-950
              sm:p-4
            "
          >

            <div className="flex min-h-full justify-center">

              <Document
                file={pdfUrl}
                loading={
                  <div className="mt-10 text-slate-500">
                    Loading PDF...
                  </div>
                }
                onLoadSuccess={({
                  numPages: pages,
                }) => {

                  setNumPages(pages);

                  if (
                    selectedPage > pages
                  ) {
                    setSelectedPage(1);
                  }

                }}
              >

                <Page
                  pageNumber={
                    selectedPage
                  }
                  width={
                    viewerWidth
                  }
                />

              </Document>

            </div>

          </div>

        </>

      )}

    </section>
  );
}

export default PDFViewer;