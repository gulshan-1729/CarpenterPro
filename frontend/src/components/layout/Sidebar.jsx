import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Sofa,
  FileText,
  Receipt,
  X,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
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
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <X size={24} />
        </button>

      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-2">

        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          to="/customers"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <Users size={20} />
          Customers
        </Link>

        <Link
          to="/furniture"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <Sofa size={20} />
          Furniture
        </Link>

        <Link
          to="/quotations"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <FileText size={20} />
          Quotations
        </Link>

        <Link
          to="/invoices"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <Receipt size={20} />
          Invoices
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;