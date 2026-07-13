import {
  BrainCircuit,
  Moon,
  Bell,
  Settings,
} from "lucide-react";

function Navbar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-8">

      {/* Left */}

      <div className="flex items-center gap-3">

        <div className="bg-blue-600 p-2 rounded-xl">
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

        <p className="text-green-400 text-sm font-medium">
          AI Ready
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <Bell
          className="text-slate-300 cursor-pointer hover:text-white"
          size={22}
        />

        <Moon
          className="text-slate-300 cursor-pointer hover:text-white"
          size={22}
        />

        <Settings
          className="text-slate-300 cursor-pointer hover:text-white"
          size={22}
        />

        <img
          src="https://ui-avatars.com/api/?name=Vaibhav&background=2563eb&color=fff"
          className="w-10 h-10 rounded-full border-2 border-blue-500"
        />

      </div>

    </header>
  );
}

export default Navbar;