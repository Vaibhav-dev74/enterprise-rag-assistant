import { useState } from "react";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import ChatBox from "../components/chat/ChatBox";
import PDFViewer from "../components/pdf/PDFViewer";

function Dashboard() {

  const [selectedDocument, setSelectedDocument] = useState("");

  const [selectedPage, setSelectedPage] = useState(1);

  return (

    <div className="h-screen flex flex-col bg-slate-950">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

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