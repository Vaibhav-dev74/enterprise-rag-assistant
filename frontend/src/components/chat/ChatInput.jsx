import { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend, disabled }) {
  const [question, setQuestion] = useState("");

  const sendMessage = () => {
    if (!question.trim()) return;

    onSend(question);
    setQuestion("");
  };

  return (
    <div className="flex gap-3">

      <input
        type="text"
        placeholder="Ask anything about your document..."
        className="flex-1 bg-slate-800 text-white rounded-xl px-5 py-4 outline-none"
        value={question}
        disabled={disabled}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        disabled={disabled}
        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5"
      >
        <Send color="white" />
      </button>

    </div>
  );
}

export default ChatInput;