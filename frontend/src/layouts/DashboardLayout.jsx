import React, { useState } from "react";
import Navbar from "../components/common/Navbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

export function DashboardLayout({ children, active = "Dashboard" }) {
  const [currentActive, setCurrentActive] = useState(active);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white flex flex-col">
      <Navbar onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)} />
      <div className="flex h-[calc(100dvh-64px)] min-h-0 w-full overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block h-full w-[220px] shrink-0 border-r border-slate-200 dark:border-slate-800 xl:w-[240px]">
          <DashboardSidebar
            active={currentActive}
            setActive={setCurrentActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        <div className="lg:hidden">
          <DashboardSidebar
            active={currentActive}
            setActive={setCurrentActive}
            mobileOpen={mobileMenuOpen}
            setMobileOpen={setMobileMenuOpen}
          />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;

