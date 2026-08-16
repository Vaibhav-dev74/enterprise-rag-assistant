import {
  useState,
  useRef,
  useEffect,
} from "react";

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
}) {

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const sessionId = useRef(
    crypto.randomUUID()
  );

  /* ================================================= */
  /* AUTO SCROLL */
  /* ================================================= */

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);

  /* ================================================= */
  /* SEND QUESTION */
  /* ================================================= */

  const sendQuestion = async (question) => {

    if (!selectedDocument) {

      toast.error(
        "Please select a document first."
      );

      return;
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

      const res = await api.post(
        "/chat",
        {
          session_id: sessionId.current,
          question,
          filename: selectedDocument,
        }
      );

      const answer =
        res.data.answer || "No answer received.";

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

      const words = answer.split(" ");

      for (const word of words) {

        current += word + " ";

        await new Promise(
          (resolve) =>
            setTimeout(resolve, 20)
        );

        setMessages((prev) => {

          const updated = [...prev];

          const last =
            updated.length - 1;

          updated[last] = {
            ...updated[last],
            text: current,
          };

          return updated;
        });
      }

    } catch (err) {

      console.error(err);

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

  return (

    <section className="flex h-full min-h-0 w-full flex-col bg-slate-950">

      {/* ================================================= */}
      {/* CHAT HEADER */}
      {/* ================================================= */}

      <header className="flex h-14 shrink-0 items-center border-b border-slate-800 px-4 sm:h-16 sm:px-6">

        <div className="min-w-0">

          <h2 className="truncate text-base font-semibold text-white sm:text-lg">

            {selectedDocument ||
              "Select a document"}

          </h2>

          {!selectedDocument && (
            <p className="text-xs text-slate-500">
              Choose a PDF to start chatting
            </p>
          )}

        </div>

      </header>

      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

        {messages.length === 0 ? (

          <EmptyState />

        ) : (

          <div className="mx-auto w-full max-w-4xl space-y-5">

            {messages.map(
              (msg, index) => (

                <Message
                  key={index}
                  role={msg.role}
                  text={msg.text}
                  sources={msg.sources}
                  setSelectedDocument={
                    setSelectedDocument
                  }
                  setSelectedPage={
                    setSelectedPage
                  }
                />

              )
            )}

            {loading && <Typing />}

            <div ref={bottomRef} />

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* INPUT */}
      {/* ================================================= */}

      <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-3 sm:p-4 lg:p-5">

        <div className="mx-auto w-full max-w-4xl">

          <ChatInput
            onSend={sendQuestion}
            disabled={
              loading || !selectedDocument
            }
          />

        </div>

      </div>

    </section>

  );
}

export default ChatBox;