import { CalendarDays } from "lucide-react";

const filters = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

const ReportFilter = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-8">

      <div className="flex items-center gap-2 mb-5">

        <CalendarDays className="w-5 h-5 text-amber-400" />

        <h2 className="text-lg font-semibold text-white">
          Filter Reports
        </h2>

      </div>

      <div className="flex flex-wrap gap-3">

        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300
            ${
              selectedFilter === filter.value
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-105"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}

      </div>

    </div>
  );
};

export default ReportFilter;