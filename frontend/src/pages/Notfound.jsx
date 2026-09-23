import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export function Notfound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-blue-500/10 text-blue-400 mb-6 ring-8 ring-blue-500/5">
          <BrainCircuit size={40} className="animate-pulse" />
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-xl font-bold text-white mt-3">
          Page Not Found in Knowledge Base
        </h2>

        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          The requested route or document citation seems to have vanished from vector space. Let's get you back on track.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/dashboard")}
            icon={Home}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default Notfound;

