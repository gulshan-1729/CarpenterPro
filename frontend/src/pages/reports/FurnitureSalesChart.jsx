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
  "#84cc16",
  "#ec4899",
];

// Normalize furniture names
const normalizeFurnitureName = (name) => {
  if (!name) return "";

  let value = String(name);

  // Remove numbering (1., 2., etc.)
  value = value.replace(/^\d+\./, "");

  // Remove text inside brackets
  value = value.replace(/\(.*?\)/g, "");

  value = value.trim().toLowerCase();

  // Merge similar names
  if (value.includes("wardrobe")) return "Wardrobe";
  if (value.includes("tv unit")) return "TV Unit";
  if (value.includes("head board")) return "Head Board";
  if (value.includes("headboard")) return "Head Board";
  if (value.includes("kitchen")) return "Kitchen";
  if (value.includes("bed")) return "Bed";
  if (value.includes("bathroom")) return "Bathroom";
  if (value.includes("door")) return "Door";
  if (value.includes("loft")) return "Loft";
  if (value.includes("shoe")) return "Shoe Rack";
  if (value.includes("study")) return "Study Table";
  if (value.includes("dressing")) return "Dressing";
  if (value.includes("cupboard")) return "Cupboard";
  if (value.includes("piling")) return "Piling";
  if (value.includes("box")) return "Box";

  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const FurnitureSalesChart = ({ quotations = [] }) => {
  const furnitureSales = {};

  quotations.forEach((quotation) => {
    quotation.items?.forEach((item) => {
      const name = normalizeFurnitureName(
        item.furnitureName
      );

      if (!name) return;

      if (!furnitureSales[name]) {
        furnitureSales[name] = {
          name,
          quantity: 0,
          revenue: 0,
        };
      }

      furnitureSales[name].quantity += Number(item.qty || 1);

      furnitureSales[name].revenue += Number(
        item.total ?? item.amount ?? 0
      );
    });
  });

  const chartData = Object.values(furnitureSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-10">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          📊 Top Selling Furniture
        </h2>

        <p className="text-slate-400">
          Most frequently quoted furniture items
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-slate-400">
          No furniture sales available.
        </div>
      ) : (
        <div className="h-[400px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{
                  fill: "#cbd5e1",
                  fontSize: 13,
                }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{
                  fill: "#cbd5e1",
                }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{
                  fill: "#1e293b",
                }}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                formatter={(value, name, props) => [
                  value,
                  "Quantity",
                ]}
              />

              <Bar
                dataKey="quantity"
                radius={[10, 10, 0, 0]}
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

export default FurnitureSalesChart;