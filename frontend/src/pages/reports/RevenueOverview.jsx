import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const RevenueOverview = ({ quotations = [] }) => {
  const monthlyRevenue = {};

  quotations.forEach((quotation) => {
    const date = new Date(quotation.date);

    if (isNaN(date.getTime())) return;

    const month = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });

    if (!monthlyRevenue[month]) {
      monthlyRevenue[month] = {
        month,
        revenue: 0,
      };
    }

    monthlyRevenue[month].revenue += Number(
      quotation.grandTotal || 0
    );
  });

  const chartData = Object.values(monthlyRevenue);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-white">
          📈 Revenue Overview
        </h2>

        <p className="text-slate-400 mt-1">
          Monthly revenue generated from quotations
        </p>

      </div>

      {chartData.length === 0 ? (

        <div className="h-[340px] flex items-center justify-center text-slate-400">
          No revenue available.
        </div>

      ) : (

        <div className="h-[340px]">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <defs>

                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#f59e0b"
                    stopOpacity={0.75}
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
                formatter={(value) => [
                  `Rs. ${Number(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  "Revenue",
                ]}
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
                itemStyle={{
                  color: "#fff",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1200}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>
  );
};

export default RevenueOverview;