import { useState } from "react";
import {
  BrainCircuit,
  Moon,
  Sun,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const { dark, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/login", { replace: true });
  };

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header
      className="
        h-16
        w-full
        shrink-0
        bg-slate-900
        dark:bg-slate-900
        border-b
        border-slate-700
        flex
        items-center
        justify-between
        px-3
        sm:px-5
        lg:px-8
        relative
        z-50
      "
    >
      {/* ================= LEFT ================= */}

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">

        {/* Logo */}

        <button
          onClick={() => navigate("/dashboard")}
          className="
            bg-blue-600
            p-2
            rounded-xl
            shadow-lg
            shadow-blue-600/20
            shrink-0
            hover:bg-blue-500
            transition
          "
        >
          <BrainCircuit
            size={25}
            color="white"
          />
        </button>

        {/* Brand */}

        <div className="min-w-0">

          <h1
            className="
              text-base
              sm:text-lg
              lg:text-xl
              font-bold
              text-white
              leading-tight
              truncate
            "
          >
            Enterprise RAG
          </h1>

          <p
            className="
              hidden
              sm:block
              text-[10px]
              lg:text-xs
              text-slate-400
              truncate
            "
          >
            AI Document Assistant
          </p>

        </div>

      </div>

      {/* ================= CENTER ================= */}

      <div
        className="
          hidden
          md:flex
          items-center
          gap-2
          absolute
          left-1/2
          -translate-x-1/2
        "
      >

        <span
          className="
            h-3
            w-3
            rounded-full
            bg-green-500
            animate-pulse
          "
        />

        <p className="text-green-400 text-sm font-medium">
          AI Ready
        </p>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex items-center gap-1 sm:gap-3 lg:gap-5">

        {/* AI Ready - Mobile */}

        <div className="flex md:hidden items-center gap-1.5">

          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-green-500
              animate-pulse
            "
          />

          <span className="hidden xs:block text-green-400 text-xs font-medium">
            AI
          </span>

        </div>

        {/* Notifications */}

        <button
          onClick={() => goTo("/notifications")}
          title="Notifications"
          className="
            relative
            p-2
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          <Bell
            size={21}
            className="text-slate-300 hover:text-white"
          />

          {/* Notification badge */}

          <span
            className="
              absolute
              -top-0.5
              -right-0.5
              bg-red-500
              text-white
              text-[9px]
              rounded-full
              min-w-[15px]
              h-[15px]
              px-1
              flex
              items-center
              justify-center
            "
          >
            0
          </span>
        </button>

        {/* Theme */}

        <button
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="
            p-2
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          {dark ? (
            <Sun
              size={21}
              className="text-yellow-400 hover:text-yellow-300"
            />
          ) : (
            <Moon
              size={21}
              className="text-slate-300 hover:text-white"
            />
          )}
        </button>

        {/* Settings */}

        <button
          onClick={() => goTo("/settings")}
          title="Settings"
          className="
            hidden
            sm:block
            p-2
            rounded-lg
            hover:bg-slate-800
            transition
          "
        >
          <Settings
            size={21}
            className="text-slate-300 hover:text-white"
          />
        </button>

        {/* ================= USER ================= */}

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex
            items-center
            gap-2
            hover:bg-slate-800
            px-1.5
            sm:px-2
            py-1.5
            rounded-xl
            transition
            max-w-[150px]
          "
        >

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=2563eb&color=fff`}
            alt="Profile"
            className="
              w-9
              h-9
              sm:w-10
              sm:h-10
              rounded-full
              border-2
              border-blue-500
              shrink-0
            "
          />

          <div className="hidden lg:block text-left min-w-0">

            <p className="text-white text-sm font-semibold truncate">
              {user?.name || "User"}
            </p>

            <p className="text-slate-400 text-xs truncate max-w-[100px]">
              {user?.email || ""}
            </p>

          </div>

          <ChevronDown
            size={17}
            className={`
              hidden
              sm:block
              text-slate-400
              transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />

        </button>

        {/* ================= DROPDOWN ================= */}

        {open && (

          <div
            className="
              absolute
              right-3
              sm:right-5
              top-[68px]
              w-[250px]
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              shadow-2xl
              overflow-hidden
              z-[100]
            "
          >

            {/* User info */}

            <div className="px-5 py-4 border-b border-slate-700">

              <p className="font-semibold text-white truncate">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-slate-400 truncate">
                {user?.email || ""}
              </p>

            </div>

            {/* Profile */}

            <button
              onClick={() => goTo("/profile")}
              className="
                flex
                items-center
                gap-3
                w-full
                px-5
                py-3
                text-slate-300
                hover:bg-slate-800
                transition
              "
            >
              <Settings size={18} />

              Profile
            </button>

            {/* Settings */}

            <button
              onClick={() => goTo("/settings")}
              className="
                flex
                items-center
                gap-3
                w-full
                px-5
                py-3
                text-slate-300
                hover:bg-slate-800
                transition
              "
            >
              <Settings size={18} />

              Settings
            </button>

            {/* Logout */}

            <button
              onClick={logout}
              className="
                flex
                items-center
                gap-3
                w-full
                px-5
                py-4
                text-red-400
                hover:bg-red-500/10
                transition
                border-t
                border-slate-700
              "
            >
              <LogOut size={18} />

              Logout
            </button>

          </div>

        )}

      </div>

    </header>
  );
}

export default Navbar;