import { Menu } from "lucide-react";

const Navbar = ({ setSidebarOpen }) => {
  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 md:px-6">

      <div className="flex items-center gap-4">

        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-white"
        >
          <Menu size={28} />
        </button>

        <h2 className="text-white text-xl font-semibold">
          Dashboard
        </h2>

      </div>

       <span className="hidden sm:block">
          Welcome, Admin
      </span>

    </div>
  );
};

export default Navbar;