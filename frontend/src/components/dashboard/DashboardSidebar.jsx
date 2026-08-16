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

import { useLocation, useNavigate } from "react-router-dom";

function DashboardSidebar({
  active,
  setActive,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavigation = (item) => {
    setActive(item.name);

    navigate(item.path);

    // Close mobile menu
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const isActive = (item) => {
    if (location.pathname === item.path) {
      return true;
    }

    return active === item.name && location.pathname === "/dashboard";
  };

  return (
    <>
      {/* ================================================= */}
      {/* MOBILE MENU BUTTON                                */}
      {/* ================================================= */}

      <button
        onClick={() => setMobileOpen?.((prev) => !prev)}
        className="
          lg:hidden
          fixed
          top-[72px]
          left-3
          z-[70]
          p-2
          rounded-lg
          bg-slate-800
          border
          border-slate-700
          text-slate-300
          shadow-lg
        "
      >
        {mobileOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* ================================================= */}
      {/* MOBILE BACKDROP                                   */}
      {/* ================================================= */}

      {mobileOpen && (

        <div
          onClick={() => setMobileOpen?.(false)}
          className="
            lg:hidden
            fixed
            inset-0
            bg-black/60
            z-[60]
          "
        />

      )}

      {/* ================================================= */}
      {/* SIDEBAR                                           */}
      {/* ================================================= */}

      <aside
        className={`
          fixed
          lg:static
          top-16
          left-0
          z-[65]
          h-[calc(100vh-4rem)]
          w-[250px]
          shrink-0
          bg-slate-900
          border-r
          border-slate-800
          transition-transform
          duration-300
          ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ================= HEADER ================= */}

        <div className="px-5 pt-7 pb-5">

          <h2 className="text-xl font-bold text-white">
            Workspace
          </h2>

        </div>

        {/* ================= MENU ================= */}

        <nav className="px-3 space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const activeItem = isActive(item);

            return (

              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`
                  w-full
                  flex
                  items-center
                  gap-4
                  px-4
                  py-3.5
                  rounded-xl
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
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                      `
                  }
                `}
              >

                <Icon
                  size={21}
                  strokeWidth={activeItem ? 2.5 : 2}
                  className="shrink-0"
                />

                <span className="font-medium">
                  {item.name}
                </span>

              </button>

            );

          })}

        </nav>

      </aside>
    </>
  );
}

export default DashboardSidebar;