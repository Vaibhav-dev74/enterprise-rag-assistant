import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X, FileText } from "lucide-react";

import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import ChatBox from "../components/chat/ChatBox";
import Sidebar from "../components/sidebar/Sidebar";
import PDFViewer from "../components/pdf/PDFViewer";

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [active, setActive] = useState("Dashboard");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedPage, setSelectedPage] = useState(1);

  // Responsive drawer states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDocsOpen, setMobileDocsOpen] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const [sessionId, setSessionIdState] = useState(
    searchParams.get("session") || ""
  );

  /* KEEP SESSION ID IN URL */
  useEffect(() => {
    const urlSession = searchParams.get("session");

    if (urlSession && urlSession !== sessionId) {
      setSessionIdState(urlSession);
    }

    if (!urlSession && !sessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionIdState(newSessionId);
      setSearchParams({ session: newSessionId }, { replace: true });
    }

    const urlDoc = searchParams.get("doc");
    if (urlDoc && urlDoc !== selectedDocument) {
      setSelectedDocument(urlDoc);
    }
  }, [searchParams, sessionId, selectedDocument, setSearchParams]);

  const setSessionId = (newSessionId) => {
    setSessionIdState(newSessionId);
    setSearchParams({ session: newSessionId });
  };

  const handleSelectPage = (page) => {
    setSelectedPage(page);
    setShowPdfViewer(true);
  };

  const handleChatUpdated = () => {
    window.dispatchEvent(new Event("chat-updated"));
  };

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col">
      {/* NAVBAR WITH RESPONSIVE CONTROLS */}
      <Navbar
        onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)}
        onToggleDocs={() => setMobileDocsOpen((prev) => !prev)}
        showDocsToggle={true}
      />

      {/* MAIN VIEWPORT */}
      <div className="relative flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">
        {/* APPLICATION SIDEBAR (DESKTOP) */}
        <aside className="hidden lg:block h-full w-[220px] shrink-0 overflow-hidden border-r border-slate-200 dark:border-slate-800 xl:w-[240px]">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </aside>

        {/* MOBILE NAVIGATION SIDEBAR DRAWER */}
        <div className="lg:hidden">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </div>

        {/* DOCUMENT SIDEBAR (DESKTOP / TABLET) */}
        <aside className="hidden md:block h-full min-h-0 w-[280px] shrink-0 overflow-hidden border-r border-slate-200 dark:border-slate-800 lg:w-[300px] xl:w-[330px]">
          <Sidebar
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
          />
        </aside>

        {/* MOBILE DOCUMENT DRAWER (< md) */}
        {mobileDocsOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setMobileDocsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <div className="absolute left-0 top-16 bottom-0 w-[300px] max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  Documents
                </span>
                <button
                  type="button"
                  onClick={() => setMobileDocsOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <Sidebar
                  selectedDocument={selectedDocument}
                  setSelectedDocument={(doc) => {
                    setSelectedDocument(doc);
                    setMobileDocsOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CHAT MAIN AREA */}
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <ChatBox
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
            setSelectedPage={handleSelectPage}
            sessionId={sessionId}
            setSessionId={setSessionId}
            onChatUpdated={handleChatUpdated}
            onTogglePdf={() => setShowPdfViewer((prev) => !prev)}
            showPdfViewer={showPdfViewer}
          />
        </main>

        {/* PDF VIEWER (RESPONSIVE SPLIT / DRAWER) */}
        {/* On 2xl screens: visible side-by-side if showPdfViewer is true or by default */}
        {/* On smaller screens (tablets/laptops): renders slide-over drawer with overlay backdrop */}
        {showPdfViewer && (
          <>
            <div
              onClick={() => setShowPdfViewer(false)}
              className="fixed inset-0 top-16 z-30 bg-black/50 backdrop-blur-xs 2xl:hidden"
            />
            <aside className="fixed inset-y-16 right-0 z-40 w-[360px] sm:w-[440px] max-w-[92vw] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl 2xl:static 2xl:z-auto 2xl:shadow-none flex flex-col min-h-0 shrink-0">
              <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                  {selectedDocument || "PDF Viewer"}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPdfViewer(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  title="Close PDF Preview"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <PDFViewer
                  selectedDocument={selectedDocument}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;