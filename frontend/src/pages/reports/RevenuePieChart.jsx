import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
];

// Normalize furniture names
const normalizeFurnitureName = (name) => {
  if (!name) return "";

  let value = String(name);

  value = value.replace(/^\d+\./, "");
  value = value.replace(/\(.*?\)/g, "");
  value = value.trim().toLowerCase();

  if (value.includes("wardrobe")) return "Wardrobe";
  if (value.includes("tv unit")) return "TV Unit";
  if (value.includes("head board")) return "Head Board";
  if (value.includes("headboard")) return "Head Board";
  if (value.includes("kitchen")) return "Kitchen";
  if (value.includes("bed")) return "Bed";
  if (value.includes("bathroom")) return "Bathroom";
  if (value.includes("door")) return "Door";
  if (value.includes("cupboard")) return "Cupboard";
  if (value.includes("study")) return "Study Table";
  if (value.includes("shoe")) return "Shoe Rack";
  if (value.includes("dressing")) return "Dressing";
  if (value.includes("loft")) return "Loft";
  if (value.includes("box")) return "Box";
  if (value.includes("piling")) return "Piling";

  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const RevenuePieChart = ({ quotations = [] }) => {
  const revenueMap = {};

  quotations.forEach((quotation) => {
    quotation.items?.forEach((item) => {
      const name = normalizeFurnitureName(
        item.furnitureName
      );

      if (!name) return;

      if (!revenueMap[name]) {
        revenueMap[name] = {
          name,
          revenue: 0,
        };
      }

      revenueMap[name].revenue += Number(
        item.total ?? item.amount ?? 0
      );
    });
  });

  const chartData = Object.values(revenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          💰 Revenue by Furniture
        </h2>

        <p className="text-slate-400">
          Highest earning furniture categories
        </p>
      </div>

      {chartData.length === 0 ? (

        <div className="h-[340px] flex items-center justify-center text-slate-400">
          No revenue data available.
        </div>

      ) : (

        <div className="h-[340px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 10,
                right: 25,
                left: 30,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                type="number"
                stroke="#94a3b8"
                tick={{ fill: "#cbd5e1" }}
              />

              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                tick={{
                  fill: "#cbd5e1",
                  fontSize: 13,
                }}
                width={100}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                cursor={{
                  fill: "#1e293b",
                }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="revenue"
                radius={[0, 8, 8, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
};

export default RevenuePieChart;