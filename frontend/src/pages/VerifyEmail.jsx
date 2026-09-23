import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, KeyRound, CheckCircle2, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { verifyEmail, resendVerification } from "../api/authapi";

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const queryEmail = searchParams.get("email") || location.state?.email || "";
  const devCode = location.state?.code || "";

  const [email, setEmail] = useState(queryEmail);
  const [code, setCode] = useState(devCode);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (queryEmail && !email) {
      setEmail(queryEmail);
    }
  }, [queryEmail]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide your email address.");
      return;
    }

    if (!code || code.trim().length < 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyEmail({ email: email.trim(), code: code.trim() });
      toast.success(res.message || "Email verified successfully!");
      setVerified(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
      const msg =
        err.response?.data?.detail || "Invalid verification code. Please check and try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email to resend code.");
      return;
    }

    try {
      setResending(true);
      const res = await resendVerification(email.trim());
      toast.success("A fresh verification code has been generated!");
      if (res.verification_code) {
        setCode(res.verification_code);
      }
    } catch (err) {
      console.error("Resend error:", err);
      const msg =
        err.response?.data?.detail || "Failed to resend code. Please try again.";
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title={verified ? "Email Verified!" : "Verify Your Email"}
      subtitle={
        verified
          ? "Your account is active. Redirecting you to sign in..."
          : "Enter the 6-digit verification code sent to your email"
      }
    >
      {verified ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-4"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 size={36} />
          </div>
          <p className="text-sm text-slate-300">
            Your email has been confirmed. You can now access your private document workspace.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/login")}
            className="w-full"
            icon={ArrowRight}
          >
            Go to Login
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          {devCode && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-300 flex items-start gap-2.5">
              <KeyRound size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Development Code: </span>
                Your verification code is{" "}
                <span className="font-mono font-bold tracking-widest text-white bg-blue-600/50 px-2 py-0.5 rounded">
                  {devCode}
                </span>
              </div>
            </div>
          )}

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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-3 text-center font-mono text-xl tracking-[0.35em] text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                required
                autoFocus
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
            Verify & Activate Account
          </Button>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-slate-400 hover:text-blue-400 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
              <span>Resend Code</span>
            </button>

            <Link
              to="/login"
              className="font-medium text-slate-400 hover:text-slate-200 transition"
            >
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default VerifyEmail;

