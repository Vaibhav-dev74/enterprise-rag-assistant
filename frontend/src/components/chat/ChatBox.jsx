import {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  UploadCloud,
  Plus,
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../api/api";

import Message from "./Message";
import ChatInput from "./ChatInput";
import Typing from "./Typing";
import EmptyState from "./EmptyState";


function ChatBox({
  selectedDocument,
  setSelectedDocument,
  setSelectedPage,

  sessionId,
  setSessionId,

  onChatUpdated,
}) {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);


  const bottomRef =
    useRef(null);


  /* =============================================== */
  /* GET CURRENT USER                                */
  /* =============================================== */

  const getUser = () => {

    try {

      return JSON.parse(
        localStorage.getItem("user") || "{}"
      );

    } catch {

      return {};

    }

  };


  /* =============================================== */
  /* LOAD OLD CONVERSATION                            */
  /* =============================================== */

  useEffect(() => {

    const loadConversation = async () => {

      if (!sessionId) {

        setMessages([]);

        return;

      }

      try {

        setHistoryLoading(true);

        const res =
          await api.get(
            `/history/session/${sessionId}`
          );

        const history =
          res.data.messages || [];

        const session =
          res.data.session;


        /* Restore selected document */

        if (session?.document) {

          setSelectedDocument(
            session.document
          );

        }


        /* Convert database messages to UI messages */

        const restoredMessages = [];


        history.forEach(
          (message) => {

            restoredMessages.push({

              role: "user",

              text:
                message.question,

            });


            restoredMessages.push({

              role: "assistant",

              text:
                message.answer,

              sources: [],

            });

          }
        );


        setMessages(
          restoredMessages
        );

      } catch (err) {

        console.error(
          "Load conversation error:",
          err
        );

        toast.error(
          "Failed to load conversation."
        );

      } finally {

        setHistoryLoading(false);

      }

    };


    loadConversation();

  }, [
    sessionId,
    setSelectedDocument,
  ]);


  /* =============================================== */
  /* AUTO SCROLL                                     */
  /* =============================================== */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [
    messages,
    loading,
  ]);


  /* =============================================== */
  /* CREATE NEW CHAT                                 */
  /* =============================================== */

  const createNewChat = () => {

    const newSessionId =
      crypto.randomUUID();


    setSessionId(
      newSessionId
    );


    setMessages([]);

    setSelectedDocument("");

    setSelectedPage(1);


    window.dispatchEvent(
      new Event("chat-updated")
    );

  };


  /* =============================================== */
  /* UPLOAD DOCUMENT FROM CHAT                        */
  /* =============================================== */

  const uploadFromChat = async (
    file
  ) => {

    if (!file) {

      return;

    }


    try {

      setUploading(true);


      const formData =
        new FormData();


      formData.append(
        "file",
        file
      );


      const res =
        await api.post(
          "/upload",
          formData,
          {
            headers: {

              "Content-Type":
                "multipart/form-data",

            },
          }
        );


      toast.success(
        res.data?.message ||
        "Document uploaded successfully"
      );


      setSelectedDocument(
        file.name
      );


      setSelectedPage(1);


      window.dispatchEvent(
        new Event(
          "documents-updated"
        )
      );


      window.dispatchEvent(
        new Event(
          "notifications-updated"
        )
      );


      setMessages((prev) => [

        ...prev,

        {

          role: "assistant",

          text:
            `"${file.name}" has been uploaded successfully. You can now ask me questions about this document.`,

          sources: [],

        },

      ]);


    } catch (err) {

      console.error(
        "Chat upload error:",
        err
      );


      const message =
        err?.response?.data?.detail ||
        "Failed to upload document.";


      toast.error(message);


    } finally {

      setUploading(false);

    }

  };


  /* =============================================== */
  /* SEND QUESTION                                    */
  /* =============================================== */

  const sendQuestion = async (
    question
  ) => {

    if (!selectedDocument) {

      toast.error(
        "Please upload or select a document first."
      );

      return;

    }


    const user =
      getUser();


    if (!user?.id) {

      toast.error(
        "User information not found. Please login again."
      );

      return;

    }


    let activeSessionId =
      sessionId;


    /* Create session if one does not exist */

    if (!activeSessionId) {

      activeSessionId =
        crypto.randomUUID();


      setSessionId(
        activeSessionId
      );

    }


    setMessages((prev) => [

      ...prev,

      {

        role: "user",

        text: question,

      },

    ]);


    setLoading(true);


    try {

      const res =
        await api.post(
          "/chat",
          {

            user_id:
              user.id,

            session_id:
              activeSessionId,

            question,

            filename:
              selectedDocument,

          }
        );


      const answer =
        res.data.answer ||
        "No answer received.";


      const sources =
        res.data.sources || [];


      setMessages((prev) => [

        ...prev,

        {

          role: "assistant",

          text: "",

          sources,

        },

      ]);


      let current = "";


      const words =
        answer.split(" ");


      for (
        const word of words
      ) {

        current +=
          word + " ";


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              15
            )
        );


        setMessages((prev) => {

          const updated =
            [...prev];


          const last =
            updated.length - 1;


          updated[last] = {

            ...updated[last],

            text: current,

          };


          return updated;

        });

      }


      /* ============================================= */
      /* REFRESH CHAT LIST                              */
      /* ============================================= */

      if (onChatUpdated) {

        onChatUpdated();

      }


      window.dispatchEvent(
        new Event("chat-updated")
      );


    } catch (err) {

      console.error(
        "Chat error:",
        err
      );


      toast.error(
        "Failed to generate answer."
      );


      setMessages((prev) => [

        ...prev,

        {

          role: "assistant",

          text:
            "Something went wrong while generating the answer.",

        },

      ]);


    } finally {

      setLoading(false);

    }

  };


  /* =============================================== */
  /* UI                                               */
  /* =============================================== */

  return (

    <section
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        bg-slate-50
        dark:bg-slate-950
      "
    >


      {/* CHAT HEADER */}

      <header
        className="
          flex
          h-16
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-200
          bg-white
          px-4
          dark:border-slate-800
          dark:bg-slate-950
          sm:px-6
        "
      >

        <div className="min-w-0">

          <h2
            className="
              truncate
              text-base
              font-semibold
              text-slate-800
              dark:text-white
              sm:text-lg
            "
          >

            {selectedDocument ||
              "New Conversation"}

          </h2>


          <p
            className="
              mt-0.5
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >

            {selectedDocument
              ? "Ask questions about this document"
              : "Select or upload a PDF to begin"}

          </p>

        </div>


        <button
          type="button"
          onClick={createNewChat}
          title="New Chat"
          className="
            flex
            shrink-0
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
            sm:px-4
          "
        >

          <Plus size={18} />

          <span className="hidden sm:inline">
            New Chat
          </span>

        </button>

      </header>


      {/* MESSAGES */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >

        {historyLoading ? (

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >

            Loading conversation...

          </div>

        ) : messages.length === 0 ? (

          <div
            className="
              flex
              h-full
              flex-col
              items-center
              justify-center
            "
          >

            <EmptyState />


            {!selectedDocument && (

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >

                <UploadCloud
                  size={18}
                  className="text-blue-500"
                />

                <span>
                  Upload a PDF using the
                  attachment button below.
                </span>

              </div>

            )}

          </div>

        ) : (

          <div
            className="
              mx-auto
              w-full
              max-w-4xl
              space-y-5
            "
          >

            {messages.map(
              (
                msg,
                index
              ) => (

                <Message
                  key={index}
                  role={msg.role}
                  text={msg.text}
                  sources={
                    msg.sources
                  }
                  setSelectedDocument={
                    setSelectedDocument
                  }
                  setSelectedPage={
                    setSelectedPage
                  }
                />

              )
            )}


            {loading && (
              <Typing />
            )}


            <div
              ref={bottomRef}
            />

          </div>

        )}

      </div>


      {/* CHAT INPUT */}

      <div
        className="
          shrink-0
          border-t
          border-slate-200
          bg-white
          p-3
          dark:border-slate-800
          dark:bg-slate-950
          sm:p-4
          lg:p-5
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-4xl
          "
        >

          <ChatInput
            onSend={
              sendQuestion
            }
            onUpload={
              uploadFromChat
            }
            disabled={
              loading ||
              uploading ||
              historyLoading
            }
            uploading={
              uploading
            }
          />

        </div>

      </div>

    </section>

  );

}


export default ChatBox;