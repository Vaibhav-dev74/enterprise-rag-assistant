import { useState, useRef, useEffect } from "react";
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

  const sessionId = useRef(crypto.randomUUID());

  // Auto-scroll chat when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, loading]);

  const sendQuestion = async (question) => {
    if (!question?.trim()) return;

    if (!selectedDocument) {
      toast.error("Please select a document.");
      return;
    }

    const userQuestion = question.trim();

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setLoading(true);

    try {
      const res = await api.post("/chat", {
        session_id: sessionId.current,
        question: userQuestion,
        filename: selectedDocument,
      });

      const answer = res.data.answer || "No answer generated.";
      const sources = res.data.sources || [];

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "",
          sources,
        },
      ]);

      let current = "";

      // Simulated streaming effect
      const words = answer.split(" ");

      for (const word of words) {
        current += word + " ";

        await new Promise((resolve) =>
          setTimeout(resolve, 20)
        );

        setMessages((prev) => {
          const updated = [...prev];

          if (updated.length === 0) {
            return prev;
          }

          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: current,
          };

          return updated;
        });
      }
    } catch (err) {
      console.error("Chat error:", err);

      toast.error("Failed to generate answer.");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong while generating the answer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full min-h-0 w-full flex flex-col bg-slate-950 overflow-hidden">

      {/* ================================================= */}
      {/* CHAT HEADER                                      */}
      {/* ================================================= */}

      <div className="h-16 min-h-16 shrink-0 border-b border-slate-800 flex items-center px-6">

        <div className="min-w-0">

          <h2 className="text-white text-lg font-semibold truncate">
            {selectedDocument || "Select a document"}
          </h2>

          {selectedDocument && (
            <p className="text-xs text-slate-500 mt-0.5">
              Ask questions about this document
            </p>
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* MESSAGES                                         */}
      {/* ================================================= */}

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 py-6">

        <div className="max-w-4xl mx-auto space-y-6">

          {messages.length === 0 ? (

            <EmptyState />

          ) : (

            messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                text={msg.text}
                sources={msg.sources}
                setSelectedDocument={setSelectedDocument}
                setSelectedPage={setSelectedPage}
              />
            ))

          )}

          {loading && <Typing />}

          <div ref={bottomRef} />

        </div>

      </div>

      {/* ================================================= */}
      {/* CHAT INPUT - ALWAYS VISIBLE                       */}
      {/* ================================================= */}

      <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-4">

        <div className="max-w-4xl mx-auto">

          <ChatInput
            onSend={sendQuestion}
            disabled={loading}
          />

          <p className="text-center text-[11px] text-slate-600 mt-2">
            AI-generated responses may contain inaccuracies. Verify
            important information.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChatBox;