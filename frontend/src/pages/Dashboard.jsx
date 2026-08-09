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
    <div className="h-screen flex flex-col bg-slate-950">

      <Navbar />

      <div className="flex flex-1">

        <DashboardSidebar
          active={active}
          setActive={setActive}
        />

        <Sidebar
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
        />

        <ChatBox
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          setSelectedPage={setSelectedPage}
        />

        <PDFViewer
          selectedDocument={selectedDocument}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />

      </div>

    </div>
  );
}

export default Dashboard;