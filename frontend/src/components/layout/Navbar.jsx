const Navbar = () => {
  return (
    <div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      <h2 className="text-white text-xl font-semibold">
        Dashboard
      </h2>

      <div className="text-slate-400">
        Welcome, Admin
      </div>
    </div>
  );
};

export default Navbar;