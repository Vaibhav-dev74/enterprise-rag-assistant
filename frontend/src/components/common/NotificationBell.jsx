import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";

export function NotificationBell({ className = "" }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/notifications/user/${user.id}/unread-count`);
      setUnreadCount(res.data?.count || 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnread();

    const handleUpdate = () => {
      fetchUnread();
    };

    window.addEventListener("notifications-updated", handleUpdate);
    const interval = setInterval(fetchUnread, 30000); // poll every 30s

    return () => {
      window.removeEventListener("notifications-updated", handleUpdate);
      clearInterval(interval);
    };
  }, [user?.id]);

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      className={`relative rounded-xl p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${className}`}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;

