import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Sofa,
  FileText,
  Receipt,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Furniture",
      path: "/furniture",
      icon: Sofa,
    },
    {
      name: "Quotations",
      path: "/quotations",
      icon: FileText,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: Receipt,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        fixed md:static
        top-0 left-0
        z-50
        min-h-screen
        w-64
        bg-slate-900
        border-r border-slate-800
        transform
        transition-transform
        duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        md:translate-x-0
      `}
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-400">
          CarpenterPro
        </h1>

        <button
          className="md:hidden text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;