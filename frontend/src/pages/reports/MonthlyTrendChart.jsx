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
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#ec4899",
];

const MonthlyTrendChart = ({ quotations = [] }) => {
  const monthlyData = {};

  quotations.forEach((quotation) => {
    const date = new Date(quotation.date);

    if (isNaN(date.getTime())) return;

    const key = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });

    if (!monthlyData[key]) {
      monthlyData[key] = {
        month: key,
        revenue: 0,
        quotations: 0,
      };
    }

    monthlyData[key].revenue += Number(
      quotation.grandTotal || 0
    );

    monthlyData[key].quotations += 1;
  });

  const chartData = Object.values(monthlyData);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          📊 Monthly Revenue
        </h2>

        <p className="text-slate-400">
          Compare revenue generated each month
        </p>

      </div>

      {chartData.length === 0 ? (

        <div className="h-[340px] flex items-center justify-center text-slate-400">
          No monthly data available.
        </div>

      ) : (

        <div className="h-[340px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="month"
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
              />

              <Tooltip
                cursor={{
                  fill: "#1e293b",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />

              <Bar
                dataKey="revenue"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.month}
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

export default MonthlyTrendChart;