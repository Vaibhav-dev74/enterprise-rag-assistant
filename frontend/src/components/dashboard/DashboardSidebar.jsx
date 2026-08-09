import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Bell,
  User,
  Settings,
} from "lucide-react";

function DashboardSidebar({ active, setActive }) {
  const menus = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chats",
      icon: MessageSquare,
    },
    {
      title: "Documents",
      icon: FileText,
    },
    {
      title: "Notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      icon: User,
    },
    {
      title: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-full">

      <div className="p-6">

        <h2 className="text-xl font-bold text-white">
          Workspace
        </h2>

      </div>

      <nav className="px-3 space-y-2">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (
            <button
              key={menu.title}
              onClick={() => setActive(menu.title)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                active === menu.title
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              {menu.title}
            </button>
          );
        })}

      </nav>

    </aside>
  );
}

export default DashboardSidebar;