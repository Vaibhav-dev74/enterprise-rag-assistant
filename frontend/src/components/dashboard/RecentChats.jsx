import React, { useState, useEffect } from "react";
import { MessageSquare, Clock, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function RecentChats({ limit = 5, onSelectSession }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/history/user/${user.id}`);
      setSessions(res.data?.sessions?.slice(0, limit) || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    const handleUpdate = () => fetchRecent();
    window.addEventListener("chat-updated", handleUpdate);
    return () => window.removeEventListener("chat-updated", handleUpdate);
  }, [user?.id]);

  const handleOpen = (session) => {
    if (onSelectSession) {
      onSelectSession(session.session_id);
    } else {
      navigate(`/dashboard?session=${session.session_id}`);
    }
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await api.delete(`/history/session/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      toast.success("Chat deleted");
      window.dispatchEvent(new Event("chat-updated"));
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No recent conversations
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Ask questions about documents to build chat history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {sessions.map((s, index) => (
        <motion.div
          key={s.session_id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleOpen(s)}
          className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-3.5 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400 shrink-0">
              <MessageSquare size={16} />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {s.title || "Untitled Conversation"}
              </h4>
              <p className="text-xs text-slate-400 truncate">
                {s.document ? `Doc: ${s.document}` : "General query"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => handleDelete(e, s.session_id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              title="Delete chat"
            >
              <Trash2 size={15} />
            </button>
            <ArrowRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default RecentChats;

