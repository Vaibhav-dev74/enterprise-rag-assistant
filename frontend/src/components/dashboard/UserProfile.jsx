import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Shield, Mail, Calendar } from "lucide-react";

export function UserProfile({ className = "" }) {
  const { user } = useAuth();

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=2563eb&color=fff&size=128`}
            alt={user?.name || "User"}
            className="h-16 w-16 rounded-2xl border-2 border-blue-500/30 object-cover shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">
              {user?.name || "Welcome!"}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Shield size={11} /> Pro
            </span>
          </div>
          <p className="flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Mail size={13} /> {user?.email || "user@enterprise-rag.com"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

