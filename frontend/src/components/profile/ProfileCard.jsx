import React from "react";
import { User, Mail, Calendar, Shield, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";

export function ProfileCard({ onEditClick }) {
  const { user } = useAuth();

  return (
    <Card className="overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative" />
      <CardContent className="pt-0 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=2563eb&color=fff&size=200`}
              alt={user?.name || "Profile"}
              className="h-24 w-24 rounded-2xl border-4 border-white dark:border-slate-900 object-cover shadow-xl"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          {onEditClick && (
            <button
              type="button"
              onClick={onEditClick}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shadow-md shadow-blue-500/20"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name || "Enterprise User"}
            </h2>
            <StatusBadge status="success" dot={false}>
              Active
            </StatusBadge>
          </div>

          <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <Mail size={14} /> {user?.email || "user@enterprise-rag.com"}
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
            <div>
              <span className="text-slate-400">Account Type</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Shield size={13} className="text-blue-500" /> Enterprise Tier
              </p>
            </div>
            <div>
              <span className="text-slate-400">RAG Access</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                <Award size={13} className="text-emerald-500" /> Full Permissions
              </p>
            </div>
            <div>
              <span className="text-slate-400">Database</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                ChromaDB + SQLite
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;

