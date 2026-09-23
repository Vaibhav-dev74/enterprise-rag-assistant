import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Bell, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const navTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
          )}&background=2563eb&color=fff&size=100`}
          alt="Avatar"
          className="h-9 w-9 rounded-xl border-2 border-blue-500/30 object-cover shadow-sm"
        />
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
          >
            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-4">
              <p className="truncate font-semibold text-slate-900 dark:text-white text-sm">
                {user?.name || "Enterprise User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user?.email || "user@enterprise-rag.com"}
              </p>
            </div>

            <div className="p-2 space-y-1 text-sm">
              <button
                type="button"
                onClick={() => navTo("/profile")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
              >
                <User size={16} className="text-blue-500" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => navTo("/settings")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
              >
                <Settings size={16} className="text-indigo-500" />
                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={() => navTo("/notifications")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
              >
                <Bell size={16} className="text-amber-500" />
                <span>Notifications</span>
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 p-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left cursor-pointer text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;

