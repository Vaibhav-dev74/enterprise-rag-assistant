import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bell,
  User,
  Settings,
  Menu,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function DashboardSidebar({
  active,
  setActive,
  mobileOpen,
  setMobileOpen,
}) {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Chats",
      path: "/chat",
      icon: MessageSquare,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  const handleNavigation = (
    item
  ) => {

    setActive(item.name);

    navigate(item.path);

    if (setMobileOpen) {
      setMobileOpen(false);
    }

  };

  const isActive = (
    item
  ) => {

    return (
      location.pathname ===
      item.path
    );

  };

  return (
    <>

      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        onClick={() =>
          setMobileOpen?.(
            (prev) => !prev
          )
        }
        className="
          fixed
          left-3
          top-[72px]
          z-[70]
          rounded-lg
          border
          border-slate-300
          bg-white
          p-2
          text-slate-700
          shadow-lg
          dark:border-slate-700
          dark:bg-slate-800
          dark:text-slate-300
          lg:hidden
        "
      >

        {mobileOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}

      </button>

      {/* BACKDROP */}

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen?.(false)
          }
          className="
            fixed
            inset-0
            z-[60]
            bg-black/60
            lg:hidden
          "
        />

      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-16
          z-[65]
          h-[calc(100vh-4rem)]
          w-[250px]
          shrink-0
          overflow-y-auto
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          ease-in-out
          dark:border-slate-800
          dark:bg-slate-900

          lg:static
          lg:h-full

          ${
            mobileOpen
              ? "translate-x-0"
              : `
                -translate-x-full
                lg:translate-x-0
              `
          }
        `}
      >

        <div className="px-5 pb-5 pt-7">

          <h2
            className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Workspace
          </h2>

        </div>

        <nav className="space-y-2 px-3 pb-5">

          {menuItems.map(
            (item) => {

              const Icon =
                item.icon;

              const activeItem =
                isActive(item);

              return (

                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    handleNavigation(item)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-xl
                    px-4
                    py-3.5
                    text-left
                    transition-all
                    duration-200

                    ${
                      activeItem
                        ? `
                          bg-blue-600
                          text-white
                          shadow-lg
                          shadow-blue-600/20
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-900
                          dark:text-slate-300
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `}
                >

                  <Icon
                    size={21}
                    strokeWidth={
                      activeItem
                        ? 2.5
                        : 2
                    }
                    className="shrink-0"
                  />

                  <span className="font-medium">
                    {item.name}
                  </span>

                </button>

              );

            }
          )}

        </nav>

      </aside>

    </>
  );
}

export default DashboardSidebar;