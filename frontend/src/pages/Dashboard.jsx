import {
  useState,
  useEffect,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

import ChatBox from "../components/chat/ChatBox";
import Sidebar from "../components/sidebar/Sidebar";
import PDFViewer from "../components/pdf/PDFViewer";


function Dashboard() {

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const [active, setActive] =
    useState("Dashboard");


  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState("");


  const [
    selectedPage,
    setSelectedPage,
  ] = useState(1);


  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    sessionId,
    setSessionIdState,
  ] = useState(
    searchParams.get("session") || ""
  );


  /* =============================================== */
  /* KEEP SESSION ID IN URL                           */
  /* =============================================== */

  useEffect(() => {

    const urlSession =
      searchParams.get("session");


    if (
      urlSession &&
      urlSession !== sessionId
    ) {

      setSessionIdState(
        urlSession
      );

    }


    if (
      !urlSession &&
      !sessionId
    ) {

      const newSessionId =
        crypto.randomUUID();


      setSessionIdState(
        newSessionId
      );


      setSearchParams(
        {
          session:
            newSessionId,
        },
        {
          replace: true,
        }
      );

    }

  }, [
    searchParams,
    sessionId,
    setSearchParams,
  ]);


  /* =============================================== */
  /* CHANGE SESSION                                   */
  /* =============================================== */

  const setSessionId = (
    newSessionId
  ) => {

    setSessionIdState(
      newSessionId
    );


    setSearchParams(
      {
        session:
          newSessionId,
      }
    );

  };


  /* =============================================== */
  /* REFRESH CHAT LIST EVENT                          */
  /* =============================================== */

  const handleChatUpdated = () => {

    window.dispatchEvent(
      new Event("chat-updated")
    );

  };


  return (

    <div
      className="
        h-dvh
        w-full
        overflow-hidden
        bg-slate-100
        text-slate-900
        dark:bg-slate-950
        dark:text-white
      "
    >

      {/* NAVBAR */}

      <Navbar />


      {/* MAIN */}

      <div
        className="
          flex
          h-[calc(100dvh-64px)]
          min-h-0
          w-full
          overflow-hidden
        "
      >

        {/* APPLICATION SIDEBAR */}

        <aside
          className="
            hidden
            lg:block
            h-full
            w-[220px]
            shrink-0
            overflow-hidden
            border-r
            border-slate-300
            dark:border-slate-800
            xl:w-[240px]
          "
        >

          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />

        </aside>


        {/* DOCUMENT SIDEBAR */}

        <aside
          className="
            hidden
            md:block
            h-full
            min-h-0
            w-[300px]
            shrink-0
            overflow-hidden
            border-r
            border-slate-300
            dark:border-slate-800
            lg:w-[320px]
            xl:w-[350px]
          "
        >

          <Sidebar
            selectedDocument={
              selectedDocument
            }
            setSelectedDocument={
              setSelectedDocument
            }
          />

        </aside>


        {/* CHAT */}

        <main
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-hidden
          "
        >

          <ChatBox

            selectedDocument={
              selectedDocument
            }

            setSelectedDocument={
              setSelectedDocument
            }

            setSelectedPage={
              setSelectedPage
            }

            sessionId={
              sessionId
            }

            setSessionId={
              setSessionId
            }

            onChatUpdated={
              handleChatUpdated
            }

          />

        </main>


        {/* PDF VIEWER */}

        <aside
          className="
            hidden
            2xl:block
            h-full
            min-h-0
            w-[380px]
            shrink-0
            overflow-hidden
            border-l
            border-slate-300
            dark:border-slate-800
          "
        >

          <PDFViewer
            selectedDocument={
              selectedDocument
            }

            selectedPage={
              selectedPage
            }

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