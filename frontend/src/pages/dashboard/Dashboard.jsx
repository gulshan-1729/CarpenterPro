import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

const Dashboard = () => {
  const [totalQuotations, setTotalQuotations] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [recentQuotations, setRecentQuotations] = useState([]);

  useEffect(() => {
    const quotations =
      JSON.parse(
        localStorage.getItem("quotationsV2")
      ) || [];

    const customers =
      JSON.parse(
        localStorage.getItem("customers")
      ) || [];

    setTotalCustomers(customers.length);

    setTotalQuotations(
      quotations.length
    );

    const revenue = quotations.reduce(
      (sum, quotation) =>
        sum +
        Number(
          quotation.grandTotal || 0
        ),
      0
    );

    setTotalRevenue(revenue);

    const currentMonth =
      new Date().getMonth();

    const currentYear =
      new Date().getFullYear();

    const monthRevenue =
      quotations
        .filter((quotation) => {
          const d = new Date(
            quotation.date
          );

          return (
            d.getMonth() ===
              currentMonth &&
            d.getFullYear() ===
              currentYear
          );
        })
        .reduce(
          (sum, quotation) =>
            sum +
            Number(
              quotation.grandTotal || 0
            ),
          0
        );

    setMonthlyRevenue(
      monthRevenue
    );

    setRecentQuotations(
      quotations
        .slice(-5)
        .reverse()
    );
  }, []);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">
          Dashboard
        </h1>

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400">
              Total Customers
            </h3>

            <p className="text-3xl text-white font-bold mt-2">
              {totalCustomers}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400">
              Total Quotations
            </h3>

            <p className="text-3xl text-blue-400 font-bold mt-2">
              {totalQuotations}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400">
              Total Revenue
            </h3>

            <p className="text-3xl text-green-400 font-bold mt-2">
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-400">
              This Month Revenue
            </h3>

            <p className="text-3xl text-yellow-400 font-bold mt-2">
              ₹
              {monthlyRevenue.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

        </div>

        {/* Recent Quotations */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-white mb-4">
            Recent Quotations
          </h2>

          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full bg-slate-900 rounded-xl overflow-hidden">

              <thead>
                <tr className="bg-slate-700 text-white">

                  <th className="p-4 text-left">
                    Customer
                  </th>

                  <th className="p-4 text-left">
                    Furniture
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentQuotations.length >
                0 ? (
                  recentQuotations.map(
                    (quotation) => (
                      <tr
                        key={
                          quotation.id
                        }
                        className="border-t border-slate-700 text-white hover:bg-slate-800 transition"
                      >

                        <td className="p-4">
                          {
                            quotation.customerName
                          }
                        </td>

                        <td className="p-4">
                          {quotation.items
                            ?.map(
                              (
                                item
                              ) =>
                                item.furnitureName
                            )
                            .join(
                              ", "
                            )}
                        </td>

                        <td className="p-4 text-green-400 font-semibold">
                          ₹
                          {Number(
                            quotation.grandTotal
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="p-4">
                          {
                            quotation.date
                          }
                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-6 text-center text-slate-400"
                    >
                      No quotations found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;