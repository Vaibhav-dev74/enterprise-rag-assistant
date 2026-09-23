import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  Plus,
  Trash2,
  Download,
  History,
  Eraser,
  X,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import api from "../../api/api";
import Message from "./Message";
import ChatInput from "./ChatInput";
import Typing from "./Typing";
import EmptyState from "./EmptyState";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

function ChatBox({
  selectedDocument,
  setSelectedDocument,
  setSelectedPage,
  sessionId,
  setSessionId,
  onChatUpdated,
  onTogglePdf,
  showPdfViewer,
}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Forget / Clear context modal
  const [forgetModalOpen, setForgetModalOpen] = useState(false);
  const [clearingContext, setClearingContext] = useState(false);

  // History Slide-over Drawer
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [userSessions, setUserSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const bottomRef = useRef(null);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  /* Load Old Conversation */
  useEffect(() => {
    const loadConversation = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }

      try {
        setHistoryLoading(true);
        const res = await api.get(`/history/session/${sessionId}`);
        const history = res.data.messages || [];
        const session = res.data.session;

        if (session?.document) {
          setSelectedDocument(session.document);
        }

        const restoredMessages = [];
        history.forEach((message) => {
          restoredMessages.push({
            role: "user",
            text: message.question,
          });
          restoredMessages.push({
            role: "assistant",
            text: message.answer,
            sources: [],
          });
        });

        setMessages(restoredMessages);
      } catch (err) {
        console.error("Load conversation error:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadConversation();
  }, [sessionId, setSelectedDocument]);

  /* Load sessions for history drawer */
  const fetchUserSessions = async () => {
    const user = getUser();
    if (!user?.id) return;
    try {
      setSessionsLoading(true);
      const res = await api.get(`/history/user/${user.id}`);
      setUserSessions(res.data?.sessions || []);
    } catch {
      // ignore
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    if (historyDrawerOpen) {
      fetchUserSessions();
    }
  }, [historyDrawerOpen]);

  /* Auto Scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Create New Chat */
  const createNewChat = () => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
    setMessages([]);
    setSelectedDocument("");
    setSelectedPage?.(1);
    window.dispatchEvent(new Event("chat-updated"));
  };

  /* Forget Context / Clear Memory */
  const handleForgetContext = async () => {
    try {
      setClearingContext(true);
      if (sessionId) {
        await api.delete(`/history/session/${sessionId}/messages`);
      }
      setMessages([]);
      setForgetModalOpen(false);
      toast.success("Conversation context cleared. Memory is reset!");
      window.dispatchEvent(new Event("chat-updated"));
    } catch (err) {
      console.error("Clear messages error:", err);
      toast.error("Failed to clear conversation context.");
    } finally {
      setClearingContext(false);
    }
  };

  /* Export Chat as Markdown */
  const exportChat = () => {
    if (messages.length === 0) {
      toast.error("No messages to export.");
      return;
    }

    let markdown = `# Enterprise RAG Conversation\n`;
    markdown += `**Document:** ${selectedDocument || "None"}\n`;
    markdown += `**Exported on:** ${new Date().toLocaleString()}\n\n---\n\n`;

    messages.forEach((m) => {
      markdown += `### ${m.role === "user" ? "User" : "Assistant"}:\n${m.text}\n\n`;
    });

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Chat exported as Markdown!");
  };

  /* Upload Document From Chat */
  const uploadFromChat = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data?.message || "Document uploaded successfully");
      setSelectedDocument(file.name);
      setSelectedPage?.(1);

      window.dispatchEvent(new Event("documents-updated"));
      window.dispatchEvent(new Event("notifications-updated"));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `"${file.name}" has been uploaded and vectorized successfully. You can now ask questions about this document.`,
          sources: [],
        },
      ]);
    } catch (err) {
      console.error("Chat upload error:", err);
      toast.error(err?.response?.data?.detail || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  /* Send Question */
  const sendQuestion = async (question) => {
    if (!selectedDocument) {
      toast.error("Please upload or select a document from the left sidebar.");
      return;
    }

    const user = getUser();
    if (!user?.id) {
      toast.error("User information not found. Please login again.");
      return;
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      activeSessionId = crypto.randomUUID();
      setSessionId(activeSessionId);
    }

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        user_id: user.id,
        session_id: activeSessionId,
        question,
        filename: selectedDocument,
      });

      const answer = res.data.answer || "No answer received.";
      const sources = res.data.sources || [];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "", sources },
      ]);

      let current = "";
      const words = answer.split(" ");

      for (const word of words) {
        current += word + " ";
        await new Promise((resolve) => setTimeout(resolve, 15));
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated.length - 1;
          updated[last] = { ...updated[last], text: current };
          return updated;
        });
      }

      if (onChatUpdated) onChatUpdated();
      window.dispatchEvent(new Event("chat-updated"));
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to generate answer.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong while retrieving document context and generating an answer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const switchSession = (sessId) => {
    setSessionId(sessId);
    setHistoryDrawerOpen(false);
  };

  return (
    <section className="relative flex h-full min-h-0 w-full flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* CHAT HEADER */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h2 className="truncate text-sm sm:text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {selectedDocument ? (
                <>
                  <FileText size={17} className="text-blue-500 shrink-0" />
                  <span className="truncate">{selectedDocument}</span>
                </>
              ) : (
                "New Knowledge Session"
              )}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {selectedDocument
                ? "Asking questions against indexed Chroma vectors"
                : "Select or upload a PDF to begin"}
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* PDF Viewer Toggle */}
          {selectedDocument && onTogglePdf && (
            <Button
              variant={showPdfViewer ? "primary" : "outline"}
              size="sm"
              onClick={onTogglePdf}
              icon={FileText}
              title={showPdfViewer ? "Hide PDF viewer" : "View PDF viewer"}
            >
              <span className="hidden sm:inline">
                {showPdfViewer ? "Hide PDF" : "View PDF"}
              </span>
            </Button>
          )}

          {/* History Drawer Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryDrawerOpen((prev) => !prev)}
            icon={History}
            title="Chat History"
          >
            <span className="hidden md:inline">History</span>
          </Button>

          {/* Forget Context / Clear Memory Button */}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setForgetModalOpen(true)}
              icon={Eraser}
              title="Forget context / Clear messages"
              className="text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            >
              <span className="hidden lg:inline">Forget Context</span>
            </Button>
          )}

          {/* Export Chat */}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChat}
              icon={Download}
              title="Export as Markdown"
              className="hidden sm:inline-flex"
            >
              <span className="hidden xl:inline">Export</span>
            </Button>
          )}

          {/* New Chat Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={createNewChat}
            icon={Plus}
          >
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>

      {/* MESSAGES & CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        {historyLoading ? (
          <div className="flex h-full items-center justify-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 animate-pulse">
            Retrieving conversation history...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <EmptyState onSelectPrompt={sendQuestion} />

            {!selectedDocument && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <UploadCloud size={16} className="text-blue-500" />
                <span>Upload a PDF using the attachment button below.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-4xl space-y-4">
            {messages.map((msg, index) => (
              <Message
                key={index}
                role={msg.role}
                text={msg.text}
                sources={msg.sources}
                setSelectedDocument={setSelectedDocument}
                setSelectedPage={setSelectedPage}
              />
            ))}

            {loading && <Typing />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* CHAT INPUT AREA */}
      <div className="shrink-0 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-3 sm:p-4">
        <div className="mx-auto w-full max-w-4xl">
          <ChatInput
            onSend={sendQuestion}
            onUpload={uploadFromChat}
            disabled={loading || uploading || historyLoading}
            uploading={uploading}
          />
        </div>
      </div>

      {/* FORGET CONTEXT CONFIRMATION MODAL */}
      <Modal
        isOpen={forgetModalOpen}
        onClose={() => setForgetModalOpen(false)}
        title="Forget Conversation Context?"
        description="This will clear all messages and queries in the current session. Your document will remain selected for new questions."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setForgetModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={clearingContext}
            onClick={handleForgetContext}
            icon={Eraser}
          >
            Yes, Clear Memory
          </Button>
        </div>
      </Modal>

      {/* SLIDE-OVER HISTORY DRAWER */}
      <AnimatePresence>
        {historyDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryDrawerOpen(false)}
              className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Chat History
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryDrawerOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {sessionsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : userSessions.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No chat history found.
                  </div>
                ) : (
                  userSessions.map((s) => (
                    <button
                      key={s.session_id}
                      type="button"
                      onClick={() => switchSession(s.session_id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        s.session_id === sessionId
                          ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <h4 className="truncate text-xs font-semibold">
                        {s.title || "Untitled Conversation"}
                      </h4>
                      <p className="truncate text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <FileText size={10} /> {s.document || "No document"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ChatBox;