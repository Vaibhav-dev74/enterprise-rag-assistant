import {
  useState,
  useEffect,
  useRef,
} from "react";

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

  const navigate = useNavigate();

  const {
    dark,
    toggleTheme,
  } = useTheme();

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef(null);

  const user = (() => {

    try {

      return (
        JSON.parse(
          localStorage.getItem("user")
        ) || {}
      );

    } catch {

      return {};

    }

  })();

  // Close dropdown when clicking outside

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

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

      <div className="flex min-w-0 items-center gap-3">

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
              text-lg
              font-bold
              text-slate-900
              dark:text-white
              sm:text-xl
            "
          >
            Enterprise RAG
          </h1>

          <p
            className="
              hidden
              text-xs
              text-slate-500
              dark:text-slate-400
              sm:block
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

        <span
          className="
            text-sm
            font-medium
            text-green-600
            dark:text-green-400
          "
        >
          AI Ready
        </span>

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

        {/* NOTIFICATIONS */}

        <button
          type="button"
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

        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            type="button"
            onClick={() =>
              setOpen(
                (prev) => !prev
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-transparent
              px-1.5
              py-1.5
              transition

              hover:bg-slate-100
              hover:border-slate-200

              dark:hover:bg-slate-800
              dark:hover:border-slate-700

              sm:px-2
            "
          >

            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=2563eb&color=fff`}
              alt="Profile"
              className="
                h-10
                w-10
                shrink-0
                rounded-full
                border-2
                border-blue-500
              "
            />

            {/* Show user details */}

            <div
              className="
                hidden
                min-w-0
                text-left
                lg:block
              "
            >

              <p
                className="
                  max-w-[120px]
                  truncate
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-white
                "
              >
                {user?.name || "User"}
              </p>

              <p
                className="
                  max-w-[120px]
                  truncate
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Account
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

          {/* USER DROPDOWN */}

          {open && (

            <div
              className="
                absolute
                right-0
                top-[58px]
                z-[100]
                w-[260px]
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-2xl

                dark:border-slate-700
                dark:bg-slate-900
              "
            >

              {/* USER INFO */}

              <div
                className="
                  border-b
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-4

                  dark:border-slate-700
                  dark:bg-slate-800/50
                "
              >

                <div className="flex items-center gap-3">

                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=2563eb&color=fff`}
                    alt="Profile"
                    className="
                      h-11
                      w-11
                      rounded-full
                    "
                  />

                  <div className="min-w-0">

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
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {user?.email ||
                        "Enterprise RAG User"}
                    </p>

                  </div>

                </div>

              </div>

              {/* PROFILE */}

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
                  py-3.5
                  text-left
                  text-slate-700
                  transition
                  hover:bg-slate-100

                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >

                <User size={18} />

                <span>
                  My Profile
                </span>

              </button>

              {/* SETTINGS */}

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
                  py-3.5
                  text-left
                  text-slate-700
                  transition
                  hover:bg-slate-100

                  dark:text-slate-300
                  dark:hover:bg-slate-800
                "
              >

                <Settings size={18} />

                <span>
                  Settings
                </span>

              </button>

              {/* LOGOUT */}

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
                  text-left
                  text-red-500
                  transition
                  hover:bg-red-50

                  dark:border-slate-700
                  dark:hover:bg-red-500/10
                "
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );
}

export default Navbar;