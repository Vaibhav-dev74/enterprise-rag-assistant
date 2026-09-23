import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Sliders,
  Cpu,
  Bell,
  Trash2,
  Save,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { StatusBadge } from "../components/ui/StatusBadge";

export function Settings() {
  const { dark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [active, setActive] = useState("Settings");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings states stored in localStorage
  const [aiModel, setAiModel] = useState(
    localStorage.getItem("rag_model") || "ollama-deepseek"
  );
  const [temperature, setTemperature] = useState(
    parseFloat(localStorage.getItem("rag_temp") || "0.3")
  );
  const [notifyOnUpload, setNotifyOnUpload] = useState(
    localStorage.getItem("notify_upload") !== "false"
  );
  const [notifyOnComplete, setNotifyOnComplete] = useState(
    localStorage.getItem("notify_complete") !== "false"
  );

  // Clear modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("rag_model", aiModel);
    localStorage.setItem("rag_temp", temperature.toString());
    localStorage.setItem("notify_upload", notifyOnUpload.toString());
    localStorage.setItem("notify_complete", notifyOnComplete.toString());
    toast.success("Settings saved successfully!");
  };

  const handleClearAllHistory = async () => {
    if (!user?.id) return;
    try {
      setClearing(true);
      await api.delete(`/history/user/${user.id}/clear`);
      setIsClearModalOpen(false);
      window.dispatchEvent(new Event("chat-updated"));
      toast.success("All conversation history has been cleared.");
    } catch (err) {
      console.error("Clear history error:", err);
      toast.error("Failed to clear chat history.");
    } finally {
      setClearing(false);
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

        {/* MAIN SETTINGS */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
                  <SettingsIcon size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Preferences & Settings
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customize your AI RAG parameters, theme, and data controls
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={saveSettings}
                icon={Save}
              >
                Save Settings
              </Button>
            </div>

            {/* THEME & APPEARANCE */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun size={18} className="text-amber-500" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>
                  Switch between dark and light modes for the workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      if (dark) toggleTheme();
                    }}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition cursor-pointer ${
                      !dark
                        ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Sun size={28} className="text-amber-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Light Mode
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!dark) toggleTheme();
                    }}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition cursor-pointer ${
                      dark
                        ? "border-blue-500 bg-blue-500/10 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <Moon size={28} className="text-blue-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Dark Mode
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* AI & RAG RETRIEVAL CONFIG */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu size={18} className="text-blue-500" />
                  RAG & AI Configuration
                </CardTitle>
                <CardDescription>
                  Tune vector retrieval depth and response generation parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Active LLM Model
                    </label>
                    <StatusBadge status="success" pulse={true}>
                      Ollama Engine Running
                    </StatusBadge>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-500/20">
                        <Cpu size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          Qwen 2.5 &bull; 7B Parameters
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Local Model Tag: <code className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-blue-600 dark:text-blue-400">qwen2.5:7b</code>
                        </p>
                      </div>
                    </div>

                    <span className="self-start sm:self-auto rounded-xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Active Local Model
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Generation Temperature ({temperature})</span>
                    <span className="text-slate-400 font-normal">
                      {temperature < 0.3
                        ? "Precise / Factual"
                        : temperature < 0.7
                        ? "Balanced"
                        : "Creative"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full sm:max-w-md accent-blue-600 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* NOTIFICATION PREFERENCES */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell size={18} className="text-purple-500" />
                  Notifications & Alerts
                </CardTitle>
                <CardDescription>
                  Configure when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Document Processing Notifications
                    </p>
                    <p className="text-xs text-slate-400">
                      Notify me when a PDF is chunked and stored in ChromaDB
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnUpload}
                    onChange={(e) => setNotifyOnUpload(e.target.checked)}
                    className="h-5 w-5 rounded accent-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Query Completion Sound/Alert
                    </p>
                    <p className="text-xs text-slate-400">
                      Notify when complex multi-page responses finish streaming
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyOnComplete}
                    onChange={(e) => setNotifyOnComplete(e.target.checked)}
                    className="h-5 w-5 rounded accent-blue-600 cursor-pointer"
                  />
                </label>
              </CardContent>
            </Card>

            {/* DANGER ZONE: FORGET DATA & CLEAR HISTORY */}
            <Card className="border-red-500/30 dark:border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-base text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Data Privacy & Memory Management
                </CardTitle>
                <CardDescription>
                  Forget past queries, clear session memory, and manage stored embeddings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Forget All Chat History
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Permanently delete all past questions, answers, and conversation sessions.
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setIsClearModalOpen(true)}
                    icon={Trash2}
                  >
                    Clear All History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Chat History?"
        description="This action will delete all conversation records for your user account. This cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsClearModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            isLoading={clearing}
            onClick={handleClearAllHistory}
            icon={Trash2}
          >
            Yes, Clear All History
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Settings;

