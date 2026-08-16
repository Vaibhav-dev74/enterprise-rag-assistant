import { useState } from "react";

import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

import ChatBox from "../components/chat/ChatBox";
import Sidebar from "../components/sidebar/Sidebar";
import PDFViewer from "../components/pdf/PDFViewer";

function Dashboard() {
  const [active, setActive] = useState("Dashboard");

  const [selectedDocument, setSelectedDocument] = useState("");

  const [selectedPage, setSelectedPage] = useState(1);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* Navbar */}

      <Navbar
        onMenuClick={() =>
          setMobileMenuOpen(true)
        }
      />

      {/* Mobile sidebar */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 lg:hidden"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        >
          <div
            className="h-full w-[280px] max-w-[85vw] bg-white dark:bg-slate-900"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <DashboardSidebar
              active={active}
              setActive={(value) => {
                setActive(value);
                setMobileMenuOpen(false);
              }}
              mobile
            />
          </div>
        </div>
      )}

      {/* Main */}

      <div className="flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">

        {/* Application sidebar */}

        <aside className="hidden lg:block w-[220px] xl:w-[240px] shrink-0 h-full overflow-hidden border-r border-slate-300 dark:border-slate-800">
          <DashboardSidebar
            active={active}
            setActive={setActive}
          />
        </aside>

        {/* Documents */}

        <aside className="hidden md:block w-[300px] lg:w-[320px] xl:w-[350px] shrink-0 h-full min-h-0 overflow-hidden border-r border-slate-300 dark:border-slate-800">
          <Sidebar
            selectedDocument={selectedDocument}
            setSelectedDocument={
              setSelectedDocument
            }
          />
        </aside>

        {/* Chat */}

        <main className="flex-1 min-w-0 min-h-0 h-full overflow-hidden">
          <ChatBox
            selectedDocument={selectedDocument}
            setSelectedDocument={
              setSelectedDocument
            }
            setSelectedPage={setSelectedPage}
          />
        </main>

        {/* PDF */}

        <aside className="hidden 2xl:block w-[350px] xl:w-[380px] shrink-0 h-full min-h-0 overflow-hidden border-l border-slate-300 dark:border-slate-800">
          <PDFViewer
            selectedDocument={selectedDocument}
            selectedPage={selectedPage}
            setSelectedPage={
              setSelectedPage
            }
          />
        </aside>

      </div>
    </div>
  );
}

export default Dashboard;