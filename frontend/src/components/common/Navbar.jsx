import { useState } from "react";

import {
  BrainCircuit,
  Moon,
  Sun,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTheme,
} from "../../context/ThemeContext";

function Navbar() {

  const navigate =
    useNavigate();

  const {
    dark,
    toggleTheme,
  } = useTheme();

  const [open, setOpen] =
    useState(false);

  const user = (() => {

    try {

      return (
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        ) || {}
      );

    } catch {

      return {};

    }

  })();

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setOpen(false);

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  const goTo = (path) => {

    setOpen(false);

    navigate(path);
  };

  return (

    <header
      className="
        relative
        z-50
        flex
        h-16
        w-full
        shrink-0
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-3
        text-slate-900
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-white
        sm:px-5
        lg:px-8
      "
    >

      {/* LEFT */}

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="
            shrink-0
            rounded-xl
            bg-blue-600
            p-2
            shadow-lg
            shadow-blue-600/20
            transition
            hover:bg-blue-500
          "
        >

          <BrainCircuit
            size={25}
            color="white"
          />

        </button>

        <div className="min-w-0">

          <h1
            className="
              truncate
              text-base
              font-bold
              leading-tight
              text-slate-900
              dark:text-white
              sm:text-lg
              lg:text-xl
            "
          >
            Enterprise RAG
          </h1>

          <p
            className="
              hidden
              truncate
              text-[10px]
              text-slate-500
              dark:text-slate-400
              sm:block
              lg:text-xs
            "
          >
            AI Document Assistant
          </p>

        </div>

      </div>

      {/* CENTER */}

      <div
        className="
          absolute
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-2
          md:flex
        "
      >

        <span
          className="
            h-3
            w-3
            animate-pulse
            rounded-full
            bg-green-500
          "
        />

        <p className="text-sm font-medium text-green-500">
          AI Ready
        </p>

      </div>

      {/* RIGHT */}

      <div
        className="
          flex
          items-center
          gap-1
          sm:gap-2
          lg:gap-3
        "
      >

        <button
          type="button"
          title="Notifications"
          onClick={() =>
            goTo("/notifications")
          }
          className="
            relative
            rounded-lg
            p-2
            transition
            hover:bg-slate-100
            dark:hover:bg-slate-800
          "
        >

          <Bell
            size={21}
            className="
              text-slate-600
              dark:text-slate-300
            "
          />

          <span
            className="
              absolute
              -right-0.5
              -top-0.5
              flex
              h-[15px]
              min-w-[15px]
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[9px]
              text-white
            "
          >
            0
          </span>

        </button>

        {/* THEME */}

        <button
          type="button"
          onClick={toggleTheme}
          title={
            dark
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="
            rounded-lg
            p-2
            transition
            hover:bg-slate-100
            dark:hover:bg-slate-800
          "
        >

          {dark ? (

            <Sun
              size={21}
              className="text-yellow-500"
            />

          ) : (

            <Moon
              size={21}
              className="text-slate-600"
            />

          )}

        </button>

        {/* SETTINGS */}

        <button
          type="button"
          title="Settings"
          onClick={() =>
            goTo("/settings")
          }
          className="
            hidden
            rounded-lg
            p-2
            transition
            hover:bg-slate-100
            dark:hover:bg-slate-800
            sm:block
          "
        >

          <Settings
            size={21}
            className="
              text-slate-600
              dark:text-slate-300
            "
          />

        </button>

        {/* USER */}

        <button
          type="button"
          onClick={() =>
            setOpen(
              (prev) => !prev
            )
          }
          className="
            flex
            max-w-[150px]
            items-center
            gap-2
            rounded-xl
            px-1.5
            py-1.5
            transition
            hover:bg-slate-100
            dark:hover:bg-slate-800
            sm:px-2
          "
        >

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=2563eb&color=fff`}
            alt="Profile"
            className="
              h-9
              w-9
              shrink-0
              rounded-full
              border-2
              border-blue-500
              sm:h-10
              sm:w-10
            "
          />

          <div className="hidden min-w-0 text-left lg:block">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {user?.name || "User"}
            </p>

            <p
              className="
                max-w-[100px]
                truncate
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {user?.email || ""}
            </p>

          </div>

          <ChevronDown
            size={17}
            className={`
              hidden
              text-slate-500
              transition-transform
              dark:text-slate-400
              sm:block
              ${
                open
                  ? "rotate-180"
                  : ""
              }
            `}
          />

        </button>

      </div>

      {/* USER DROPDOWN */}

      {open && (

        <div
          className="
            absolute
            right-3
            top-[68px]
            z-[100]
            w-[250px]
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-2xl
            dark:border-slate-700
            dark:bg-slate-900
            sm:right-5
          "
        >

          <div
            className="
              border-b
              border-slate-200
              px-5
              py-4
              dark:border-slate-700
            "
          >

            <p
              className="
                truncate
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {user?.name || "User"}
            </p>

            <p
              className="
                truncate
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {user?.email || ""}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              goTo("/profile")
            }
            className="
              flex
              w-full
              items-center
              gap-3
              px-5
              py-3
              text-slate-600
              transition
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >

            <User size={18} />

            Profile

          </button>

          <button
            type="button"
            onClick={() =>
              goTo("/settings")
            }
            className="
              flex
              w-full
              items-center
              gap-3
              px-5
              py-3
              text-slate-600
              transition
              hover:bg-slate-100
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >

            <Settings size={18} />

            Settings

          </button>

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              border-t
              border-slate-200
              px-5
              py-4
              text-red-500
              transition
              hover:bg-red-500/10
              dark:border-slate-700
            "
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      )}

    </header>

  );
}

export default Navbar;