import { Plus, Search } from "lucide-react";

const CustomerToolbar = ({
  onAddCustomer,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Customer Management
          </h1>

          <p className="text-slate-400 mt-1">
            Manage all your customers
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-4 py-3 rounded-xl font-medium text-black transition"
        >
          <Plus size={18} />
          Add Customer
        </button>

      </div>

      <div className="relative mb-6">

        <Search
          className="absolute left-4 top-4 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 text-white rounded-xl pl-12 pr-4 py-4 border border-slate-700 focus:outline-none focus:border-amber-500"
        />

      </div>
    </>
  );
};

export default CustomerToolbar;