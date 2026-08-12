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

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-slate-950">

      {/* ================================================= */}
      {/* TOP NAVBAR                                       */}
      {/* ================================================= */}

      <div className="shrink-0">
        <Navbar />
      </div>

      {/* ================================================= */}
      {/* MAIN WORKSPACE                                   */}
      {/* ================================================= */}

      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ================================================= */}
        {/* LEFT APPLICATION SIDEBAR                         */}
        {/* ================================================= */}

        <aside className="w-[250px] shrink-0 h-full min-h-0 overflow-y-auto border-r border-slate-800">

          <DashboardSidebar
            active={active}
            setActive={setActive}
          />

        </aside>

        {/* ================================================= */}
        {/* DOCUMENT SIDEBAR                                 */}
        {/* ================================================= */}

        <aside className="w-[360px] shrink-0 h-full min-h-0 overflow-hidden border-r border-slate-800">

          <Sidebar
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
          />

        </aside>

        {/* ================================================= */}
        {/* CHAT AREA                                        */}
        {/* ================================================= */}

        <main className="flex-1 min-w-0 min-h-0 h-full overflow-hidden">

          <ChatBox
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
            setSelectedPage={setSelectedPage}
          />

        </main>

        {/* ================================================= */}
        {/* PDF PREVIEW                                      */}
        {/* ================================================= */}

        <aside className="w-[380px] shrink-0 h-full min-h-0 overflow-hidden border-l border-slate-800">

          <PDFViewer
            selectedDocument={selectedDocument}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />

        </aside>

      </div>

    </div>
  );
}

export default Dashboard;