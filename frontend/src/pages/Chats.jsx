import React, { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  FileText,
  Clock,
  RefreshCw,
  Search,
  Edit2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";

function Chats() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Chats");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rename modal
  const [renameSession, setRenameSession] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [renaming, setRenaming] = useState(false);

  // Delete modal
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Clear all modal
  const [clearAllModal, setClearAllModal] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);

  const loadChats = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/history/user/${user.id}`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error("Load chats error:", err);
      toast.error("Failed to load conversations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
    const handleUpdate = () => loadChats();
    window.addEventListener("chat-updated", handleUpdate);
    return () => window.removeEventListener("chat-updated", handleUpdate);
  }, [user?.id]);

  const createNewChat = () => {
    const newSessionId = crypto.randomUUID();
    navigate(`/dashboard?session=${newSessionId}`);
  };

  const openChat = (session) => {
    navigate(`/dashboard?session=${session.session_id}`);
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renameSession || !newTitle.trim()) return;

    try {
      setRenaming(true);
      await api.put(`/history/session/${renameSession.session_id}/title`, {
        title: newTitle.trim(),
      });
      setSessions((prev) =>
        prev.map((s) =>
          s.session_id === renameSession.session_id
            ? { ...s, title: newTitle.trim() }
            : s
        )
      );
      setRenameSession(null);
      toast.success("Conversation renamed successfully!");
      window.dispatchEvent(new Event("chat-updated"));
    } catch (err) {
      console.error("Rename error:", err);
      toast.error("Failed to rename conversation.");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;
    try {
      setDeleting(true);
      await api.delete(`/history/session/${sessionToDelete.session_id}`);
      setSessions((prev) =>
        prev.filter((s) => s.session_id !== sessionToDelete.session_id)
      );
      setSessionToDelete(null);
      toast.success("Conversation deleted.");
      window.dispatchEvent(new Event("chat-updated"));
    } catch (err) {
      toast.error("Failed to delete conversation.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearAll = async () => {
    if (!user?.id) return;
    try {
      setClearingAll(true);
      await api.delete(`/history/user/${user.id}/clear`);
      setSessions([]);
      setClearAllModal(false);
      toast.success("All conversation history cleared.");
      window.dispatchEvent(new Event("chat-updated"));
    } catch (err) {
      toast.error("Failed to clear chat history.");
    } finally {
      setClearingAll(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently";
    const date = new Date(dateValue);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredSessions = sessions.filter((session) => {
    const query = search.toLowerCase();
    return (
      session.title?.toLowerCase().includes(query) ||
      session.document?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col">
      <Navbar onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)} />

      <div className="flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block h-full w-[220px] shrink-0 border-r border-slate-200 dark:border-slate-800 xl:w-[240px]">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        <div className="lg:hidden">
          <DashboardSidebar
            active={active}
            setActive={setActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </div>

        {/* MAIN CHAT LIST */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Conversations
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {sessions.length} saved dialogue{sessions.length === 1 ? "" : "s"} &bull; RAG history
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {sessions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClearAllModal(true)}
                    className="text-red-500 hover:bg-red-500/10"
                    icon={Trash2}
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadChats}
                  disabled={loading}
                  icon={RefreshCw}
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={createNewChat}
                  icon={Plus}
                >
                  New Chat
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search past conversations or documents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Conversations Grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center">
                <MessageSquare size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                  No conversations found
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {search
                    ? "Try adjusting your search keywords."
                    : "Start your first chat session against indexed documents."}
                </p>
                <div className="mt-5">
                  <Button variant="primary" size="md" onClick={createNewChat} icon={Plus}>
                    Start New Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredSessions.map((session) => (
                    <motion.div
                      key={session.session_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => openChat(session)}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3
                            title={session.title}
                            className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
                          >
                            {session.title || "New Conversation"}
                          </h3>

                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenameSession(session);
                                setNewTitle(session.title || "");
                              }}
                              title="Rename chat"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSessionToDelete(session);
                              }}
                              title="Delete chat"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <FileText size={14} className="text-blue-500 shrink-0" />
                          <span className="truncate">
                            {session.document || "Direct Prompt / General"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(session.updated_at || session.created_at)}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition">
                          Open <ArrowRight size={12} />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* RENAME MODAL */}
      <Modal
        isOpen={!!renameSession}
        onClose={() => setRenameSession(null)}
        title="Rename Conversation"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Conversation Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRenameSession(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={renaming}
            >
              Save Title
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        title="Delete Conversation?"
        description={`Are you sure you want to delete "${sessionToDelete?.title}"?`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSessionToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={deleting}
            onClick={handleDelete}
            icon={Trash2}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* CLEAR ALL MODAL */}
      <Modal
        isOpen={clearAllModal}
        onClose={() => setClearAllModal(false)}
        title="Clear All Conversations?"
        description="This will permanently delete all your conversation sessions and messages. This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearAllModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={clearingAll}
            onClick={handleClearAll}
            icon={Trash2}
          >
            Yes, Clear All
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Chats;