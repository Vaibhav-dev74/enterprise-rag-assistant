import { useState } from "react";
import {
  BrainCircuit,
  Moon,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-8">

      {/* Left */}

      <div className="flex items-center gap-3">

        <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
          <BrainCircuit size={26} color="white" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">
            Enterprise RAG
          </h1>

          <p className="text-xs text-slate-400">
            AI Document Assistant
          </p>
        </div>

      </div>

      {/* Center */}

      <div className="flex items-center gap-3">

        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>

        <p className="text-green-400 font-medium">
          AI Ready
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5 relative">

        {/* Notification */}

        <button className="relative">

          <Bell
            size={22}
            className="text-slate-300 hover:text-white transition"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            0
          </span>

        </button>

        {/* Theme */}

        <Moon
          size={22}
          className="cursor-pointer text-slate-300 hover:text-white transition"
        />

        {/* Settings */}

        <Settings
          size={22}
          className="cursor-pointer text-slate-300 hover:text-white transition"
        />

        {/* User */}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 hover:bg-slate-800 px-3 py-2 rounded-xl transition"
        >

          <img
            src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=2563eb&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />

          <div className="hidden md:block text-left">

            <p className="text-white text-sm font-semibold">
              {user?.name}
            </p>

            <p className="text-slate-400 text-xs">
              {user?.email}
            </p>

          </div>

          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />

        </button>

        {/* Dropdown */}

        {open && (

          <div className="absolute right-0 top-16 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">

            <div className="px-5 py-4 border-b border-slate-700">

              <p className="font-semibold text-white">
                {user?.name}
              </p>

              <p className="text-sm text-slate-400">
                {user?.email}
              </p>

            </div>

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-5 py-4 text-red-400 hover:bg-slate-800 transition"
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