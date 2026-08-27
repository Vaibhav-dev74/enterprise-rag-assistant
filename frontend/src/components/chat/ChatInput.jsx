import {
  useRef,
  useState,
} from "react";

import {
  Send,
  Paperclip,
  X,
  FileText,
  Loader2,
} from "lucide-react";

function ChatInput({
  onSend,
  onUpload,
  disabled,
  uploading,
}) {

  const [question, setQuestion] =
    useState("");

  const fileInputRef =
    useRef(null);

  const handleSubmit = (event) => {

    event.preventDefault();

    const trimmed =
      question.trim();

    if (
      !trimmed ||
      disabled
    ) {
      return;
    }

    onSend(trimmed);

    setQuestion("");

  };

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {

      alert(
        "Please select a PDF file."
      );

      event.target.value = "";

      return;

    }

    if (onUpload) {

      onUpload(file);

    }

    event.target.value = "";

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="
        flex
        items-center
        gap-2
      "
    >

      {/* HIDDEN FILE INPUT */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* UPLOAD BUTTON */}

      <button
        type="button"
        disabled={uploading}
        onClick={() =>
          fileInputRef.current?.click()
        }
        title="Upload PDF"
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-slate-300
          bg-white
          text-slate-500
          transition

          hover:border-blue-400
          hover:bg-blue-50
          hover:text-blue-600

          disabled:cursor-not-allowed
          disabled:opacity-50

          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-300
          dark:hover:border-blue-500
          dark:hover:bg-blue-500/10
          dark:hover:text-blue-400
        "
      >

        {uploading ? (

          <Loader2
            size={21}
            className="animate-spin"
          />

        ) : (

          <Paperclip size={21} />

        )}

      </button>

      {/* INPUT */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          rounded-xl
          border
          border-slate-300
          bg-white

          focus-within:border-blue-500
          focus-within:ring-2
          focus-within:ring-blue-500/10

          dark:border-slate-700
          dark:bg-slate-800
        "
      >

        <textarea
          value={question}
          disabled={disabled}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          onKeyDown={(event) => {

            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {

              event.preventDefault();

              handleSubmit(event);

            }

          }}
          placeholder={
            disabled
              ? "Upload or select a document to start..."
              : "Ask anything about your document..."
          }
          rows={1}
          className="
            max-h-32
            min-h-[48px]
            w-full
            resize-none
            bg-transparent
            px-4
            py-3
            text-slate-800
            outline-none
            placeholder:text-slate-400

            disabled:cursor-not-allowed
            disabled:opacity-60

            dark:text-white
            dark:placeholder:text-slate-500
          "
        />

      </div>

      {/* SEND BUTTON */}

      <button
        type="submit"
        disabled={
          disabled ||
          !question.trim()
        }
        title="Send message"
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          text-white
          shadow-sm
          transition

          hover:bg-blue-700
          hover:shadow-md

          disabled:cursor-not-allowed
          disabled:bg-slate-300

          dark:disabled:bg-slate-700
        "
      >

        <Send size={21} />

      </button>

    </form>

  );
}

export default ChatInput;