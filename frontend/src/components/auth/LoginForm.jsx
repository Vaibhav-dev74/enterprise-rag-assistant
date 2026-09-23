import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authapi";
import { Button } from "../ui/Button";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setUnverifiedEmail(null);
      const data = await loginUser(form);
      login(data.access_token, data.user);
      toast.success(`Welcome back, ${data.user.name || "User"}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.detail || "Invalid email or password. Please try again.";
      toast.error(msg);

      if (err.response?.status === 403 || msg.toLowerCase().includes("verif")) {
        setUnverifiedEmail(form.email);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {unverifiedEmail && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center justify-between gap-2">
          <span>Email not verified yet.</span>
          <Link
            to={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
            className="font-bold underline text-amber-200 hover:text-white"
          >
            Verify Now &rarr;
          </Link>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/80 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
        Sign In to Workspace
      </Button>

      <div className="pt-2 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-400 hover:text-blue-300 transition"
        >
          Create one now
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;

