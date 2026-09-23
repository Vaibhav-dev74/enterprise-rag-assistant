import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { forgotPassword, resetPassword } from "../api/authapi";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = request code, 2 = enter code & reset, 3 = success
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide your registered email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setGeneratedCode(res.reset_code || "");
      toast.success("Reset code generated! Check below to enter your code.");
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(
        err.response?.data?.detail || "No account found with this email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword({
        email,
        token: token.trim(),
        new_password: newPassword,
      });

      toast.success("Password reset successfully!");
      setStep(3);
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(
        err.response?.data?.detail || "Invalid or expired reset code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={
        step === 1
          ? "Reset Your Password"
          : step === 2
          ? "Set New Password"
          : "All Set!"
      }
      subtitle={
        step === 1
          ? "Enter your email to receive a secure recovery code"
          : step === 2
          ? "Enter the 6-digit code and your new credentials"
          : "Your account password has been updated"
      }
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleRequestCode}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Send Recovery Code
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleResetPassword}
            className="space-y-4"
          >
            {generatedCode && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-300 flex items-center justify-between">
                <span>Verification code generated:</span>
                <span className="font-mono font-bold text-sm text-blue-200 tracking-wider">
                  {generatedCode}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                6-Digit Reset Code
              </label>
              <div className="relative">
                <KeyRound
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full font-mono tracking-wider rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password (min 6 chars)
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="flex-1"
              >
                Update Password
              </Button>
            </div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-8 ring-emerald-500/5">
              <CheckCircle2 size={36} />
            </div>

            <p className="text-sm text-slate-300">
              Your password has been changed securely. You can now use your new credentials to sign in.
            </p>

            <Button
              type="button"
              variant="success"
              size="lg"
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Sign In Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

export default ForgotPassword;

