import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, Trash2, FileText, Shield, Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function NotificationPanel({ limit = 4, className = "" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/notifications/user/${user.id}`);
      setNotifications(res.data?.notifications?.slice(0, limit) || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    const handleUpdate = () => fetchNotes();
    window.addEventListener("notifications-updated", handleUpdate);
    return () => window.removeEventListener("notifications-updated", handleUpdate);
  }, [user?.id]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      window.dispatchEvent(new Event("notifications-updated"));
    } catch {
      // ignore
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText size={16} className="text-blue-500" />;
      case "security":
        return <Shield size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-indigo-500" />;
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

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
            Recent Alerts
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No notifications yet
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-3 py-3 transition cursor-pointer ${
                !n.is_read ? "font-medium" : "opacity-75"
              }`}
            >
              <div className="mt-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-2 shrink-0">
                {getIcon(n.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  {!n.is_read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
                <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;

