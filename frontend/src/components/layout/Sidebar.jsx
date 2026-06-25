import { Link } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Sofa,
  FileText,
  Receipt,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-amber-400">
          CarpenterPro
        </h1>
      </div>

      <nav className="px-4 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 cursor-pointer">
          <Users size={20} />
          Customers
        </div>

        <Link to="/furniture"className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800">
          <Sofa size={20} />
          Furniture
        </Link>

        <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 cursor-pointer">
          <FileText size={20} />
          Quotations
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 cursor-pointer">
          <Receipt size={20} />
          Invoices
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;