import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  FileText,
  Shield,
  Info,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, document, security
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("Notifications");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/notifications/user/${user.id}`);
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error("Notifications fetch error:", err);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await api.put(`/notifications/user/${user.id}/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      window.dispatchEvent(new Event("notifications-updated"));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to update notifications.");
    }
  };

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

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      window.dispatchEvent(new Event("notifications-updated"));
      toast.success("Notification removed.");
    } catch {
      toast.error("Failed to delete notification.");
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread" && n.is_read) return false;
    if (filter === "document" && n.type !== "document") return false;
    if (filter === "security" && n.type !== "security") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title?.toLowerCase().includes(q) || n.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText size={18} className="text-blue-500" />;
      case "security":
        return <Shield size={18} className="text-amber-500" />;
      default:
        return <Info size={18} className="text-indigo-500" />;
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

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

        {/* MAIN NOTIFICATIONS INBOX */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Notifications
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchNotifications}
                  disabled={loading}
                  icon={RefreshCw}
                >
                  Refresh
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={markAllRead}
                    icon={CheckCheck}
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: "all", label: "All" },
                  { id: "unread", label: `Unread (${unreadCount})` },
                  { id: "document", label: "Documents" },
                  { id: "security", label: "Security" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      filter === tab.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter alerts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Notification List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-3">
                  <Bell size={28} />
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                  No notifications to display
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  {filter === "unread"
                    ? "You are all caught up! No unread messages."
                    : "Upload documents or query the knowledge base to see activity alerts here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filtered.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => markRead(item.id)}
                      className={`group relative flex items-start justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition cursor-pointer ${
                        !item.is_read
                          ? "border-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm"
                          : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {!item.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-2xl" />
                      )}

                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2.5 shrink-0 mt-0.5">
                          {getIcon(item.type)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-semibold truncate ${
                                !item.is_read
                                  ? "text-blue-950 dark:text-blue-100"
                                  : "text-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {item.title}
                            </h4>
                            {!item.is_read && (
                              <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.message}
                          </p>

                          <span className="inline-block mt-2 text-[11px] font-medium text-slate-400">
                            {formatTimestamp(item.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => deleteNotification(e, item.id)}
                          title="Delete notification"
                          className="rounded-lg p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Notifications;

