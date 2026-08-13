import { Menu, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const userName = user?.name || "User";

  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 md:px-6">

      {/* =========================================
          LEFT SIDE
      ========================================= */}

      <div className="flex items-center gap-4">

        {/* Mobile Menu */}

        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-slate-300 hover:text-white transition"
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>

        {/* Page Title */}

        <h2 className="text-white text-xl font-semibold">
          Dashboard
        </h2>

      </div>


      {/* =========================================
          RIGHT SIDE
      ========================================= */}

      <div className="flex items-center gap-3">

        {/* User Information */}

        <div className="hidden sm:flex items-center gap-2 text-slate-200">

          <UserCircle
            size={24}
            className="text-amber-400"
          />

          <span className="font-medium">
            Welcome, {userName}
          </span>

        </div>


        {/* Logout Button */}

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-3 py-2
            rounded-lg
            border border-slate-700
            text-slate-300
            hover:text-white
            hover:bg-red-500/10
            hover:border-red-500/40
            transition-all duration-200
          "
          title="Logout"
        >

          <LogOut size={18} />

          <span className="hidden sm:inline">
            Logout
          </span>

        </button>

      </div>

    </div>
  );
};

export default Navbar;