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

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendQuestion = async (question) => {
    if (!selectedDocument) {
      toast.error("Please select a document first.");
      return;
    }

    // Add User Message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setLoading(true);

    try {
      const res = await api.post("/chat", {
        question,
        filename: selectedDocument,
      });

      // Add Empty Assistant Message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "",
          sources: res.data.sources,
        },
      ]);

      const words = res.data.answer.split(" ");

      let current = "";

      // ChatGPT typing animation
      for (const word of words) {
        current += word + " ";

        await new Promise((resolve) =>
          setTimeout(resolve, 25)
        );

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: current,
          };

          return updated;
        });
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to get response.");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-950">

      {/* Header */}

      <div className="h-16 border-b border-slate-800 flex items-center px-8">

        <h2 className="text-white font-semibold text-lg">

          {selectedDocument || "Select a document"}

        </h2>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-8 space-y-6">

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

        <div ref={bottomRef}></div>

      </div>

      {/* Chat Input */}

      <div className="border-t border-slate-800 p-6">

        <ChatInput
          onSend={sendQuestion}
          disabled={loading}
        />

      </div>

    </div>
  );
}

export default ChatBox;