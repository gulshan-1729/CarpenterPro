import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const RevenueOverview = ({ quotations }) => {
  const monthlyRevenue = {};

  quotations.forEach((quotation) => {
    const date = new Date(quotation.date);

    if (isNaN(date.getTime())) return;

    const month = date.toLocaleString("default", {
      month: "short",
    });

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = 0;
    }

    monthlyRevenue[month] += Number(
      quotation.grandTotal || 0
    );
  });

  const chartData = Object.keys(monthlyRevenue).map((month) => ({
    month,
    revenue: monthlyRevenue[month],
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-10">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          📈 Revenue Overview
        </h2>

        <p className="text-slate-400 mt-1">
          Monthly revenue generated from quotations
        </p>

      </div>

      {chartData.length === 0 ? (

        <div className="h-[350px] flex justify-center items-center text-slate-400">
          No revenue data available.
        </div>

      ) : (

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={chartData}>

              <defs>

                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#f59e0b"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#f59e0b"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
              />

              <YAxis
                stroke="#94a3b8"
              />

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
};

export default RevenueOverview;