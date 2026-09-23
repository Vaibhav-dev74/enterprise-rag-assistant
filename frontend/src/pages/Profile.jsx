import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Calendar,
  Save,
  KeyRound,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../api/authapi";
import api from "../api/api";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import ProfileCard from "../components/profile/ProfileCard";

export function Profile() {
  const { user, updateUser } = useAuth();
  const [active, setActive] = useState("Profile");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    documents: 0,
    chats: 0,
    storage: "0 MB",
  });

  // Profile edit state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [docsRes, chatsRes] = await Promise.all([
          api.get("/documents"),
          user?.id ? api.get(`/history/user/${user.id}`) : Promise.resolve({ data: { sessions: [] } }),
        ]);

        const docs = docsRes.data?.documents || [];
        const totalMb = docs.reduce((acc, d) => acc + (d.size_mb || 0), 0);

        setStats({
          documents: docs.length,
          chats: chatsRes.data?.sessions?.length || 0,
          storage: `${totalMb.toFixed(1)} MB`,
        });
      } catch (err) {
        console.error("Stats load error:", err);
      }
    };
    loadStats();
  }, [user?.id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in both name and email.");
      return;
    }

    try {
      setProfileLoading(true);
      const res = await updateProfile({
        user_id: user.id,
        name,
        email,
      });

      updateUser(res.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword({
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      toast.error(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
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

        {/* MAIN PROFILE CONTENT */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6 pb-8">
            {/* Profile Card Banner */}
            <ProfileCard />

            {/* Account Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-5 flex items-center gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                  <FileText size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded Documents
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {stats.documents}
                  </h4>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-5 flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active Conversations
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {stats.chats}
                  </h4>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-5 flex items-center gap-4">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
                  <Sparkles size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vector Cache Used
                  </p>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {stats.storage}
                  </h4>
                </div>
              </div>
            </div>

            {/* Two Column Section: Edit Profile & Change Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EDIT INFORMATION */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User size={18} className="text-blue-500" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your account details and display name
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={profileLoading}
                      icon={Save}
                      className="w-full mt-2"
                    >
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* CHANGE PASSWORD */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <KeyRound size={18} className="text-amber-500" />
                    Security & Password
                  </CardTitle>
                  <CardDescription>
                    Ensure your account stays protected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        New Password (min. 6 chars)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="secondary"
                      size="md"
                      isLoading={passwordLoading}
                      icon={Lock}
                      className="w-full mt-2"
                    >
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;

