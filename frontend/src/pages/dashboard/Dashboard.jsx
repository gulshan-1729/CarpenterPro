import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import {
  customerAPI,
  quotationAPI,
} from "../../services/api";

const Dashboard = () => {
  // ==========================================
  // DASHBOARD STATE
  // ==========================================

  const [totalQuotations, setTotalQuotations] =
    useState(0);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [monthlyRevenue, setMonthlyRevenue] =
    useState(0);

  const [totalCustomers, setTotalCustomers] =
    useState(0);

  const [recentQuotations, setRecentQuotations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load real data from Django/MySQL
        const [
          customers,
          quotations,
        ] = await Promise.all([
          customerAPI.getAll(),
          quotationAPI.getAll(),
        ]);

        const customerData =
          Array.isArray(customers)
            ? customers
            : [];

        const quotationData =
          Array.isArray(quotations)
            ? quotations
            : [];


        // ========================================
        // TOTAL CUSTOMERS
        // ========================================

        setTotalCustomers(
          customerData.length
        );


        // ========================================
        // TOTAL QUOTATIONS
        // ========================================

        setTotalQuotations(
          quotationData.length
        );


        // ========================================
        // TOTAL REVENUE
        // ========================================

        const revenue =
          quotationData.reduce(
            (sum, quotation) =>
              sum +
              Number(
                quotation.grand_total || 0
              ),
            0
          );

        setTotalRevenue(revenue);


        // ========================================
        // THIS MONTH REVENUE
        // ========================================

        const now = new Date();

        const currentMonth =
          now.getMonth();

        const currentYear =
          now.getFullYear();

        const monthRevenue =
          quotationData
            .filter((quotation) => {

              const quotationDate =
                new Date(
                  quotation.date
                );

              return (
                quotationDate.getMonth() ===
                  currentMonth &&
                quotationDate.getFullYear() ===
                  currentYear
              );
            })
            .reduce(
              (sum, quotation) =>
                sum +
                Number(
                  quotation.grand_total || 0
                ),
              0
            );

        setMonthlyRevenue(
          monthRevenue
        );


        // ========================================
        // CUSTOMER LOOKUP
        // ========================================

        const customerMap =
          customerData.reduce(
            (map, customer) => {

              map[customer.id] =
                customer.name;

              return map;

            },
            {}
          );


        // ========================================
        // RECENT QUOTATIONS
        // ========================================

        const recent =
          quotationData
            .slice(0, 5)
            .map((quotation) => ({

              ...quotation,

              customerName:
                customerMap[
                  quotation.customer
                ] ||
                "Unknown Customer",

              furnitureNames:
                quotation.items
                  ?.map(
                    (item) =>
                      item.furniture_name
                  )
                  .filter(Boolean)
                  .join(", ") ||
                "No furniture",

            }));

        setRecentQuotations(
          recent
        );

      } catch (err) {

        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          err.message ||
          "Failed to load dashboard data."
        );

      } finally {

        setLoading(false);

      }
    };

    loadDashboardData();

  }, []);


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout>

      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center justify-between mb-8">

          <h1 className="text-3xl font-bold text-white">
            Dashboard
          </h1>

          {loading && (
            <span className="text-sm text-slate-400">
              Loading...
            </span>
          )}

        </div>


        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}


        {/* =====================================
            STATISTICS CARDS
        ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* TOTAL CUSTOMERS */}

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h3 className="text-slate-400">
              Total Customers
            </h3>

            <p className="text-3xl text-white font-bold mt-2">

              {loading
                ? "..."
                : totalCustomers}

            </p>

          </div>


          {/* TOTAL QUOTATIONS */}

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h3 className="text-slate-400">
              Total Quotations
            </h3>

            <p className="text-3xl text-blue-400 font-bold mt-2">

              {loading
                ? "..."
                : totalQuotations}

            </p>

          </div>


          {/* TOTAL REVENUE */}

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h3 className="text-slate-400">
              Total Revenue
            </h3>

            <p className="text-3xl text-green-400 font-bold mt-2">

              ₹
              {loading
                ? "..."
                : formatCurrency(
                    totalRevenue
                  )}

            </p>

          </div>


          {/* MONTHLY REVENUE */}

          <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">

            <h3 className="text-slate-400">
              This Month Revenue
            </h3>

            <p className="text-3xl text-yellow-400 font-bold mt-2">

              ₹
              {loading
                ? "..."
                : formatCurrency(
                    monthlyRevenue
                  )}

            </p>

          </div>

        </div>


        {/* =====================================
            RECENT QUOTATIONS
        ===================================== */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-white mb-4">
            Recent Quotations
          </h2>


          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full bg-slate-900 rounded-xl overflow-hidden">

              {/* TABLE HEADER */}

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


              {/* TABLE BODY */}

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="p-8 text-center text-slate-400"
                    >
                      Loading quotations...
                    </td>

                  </tr>

                ) : recentQuotations.length > 0 ? (

                  recentQuotations.map(
                    (quotation) => (

                      <tr
                        key={quotation.id}
                        className="border-t border-slate-700 text-white hover:bg-slate-800 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="p-4">

                          {quotation.customerName}

                        </td>


                        {/* FURNITURE */}

                        <td className="p-4">

                          {quotation.furnitureNames}

                        </td>


                        {/* AMOUNT */}

                        <td className="p-4 text-green-400 font-semibold">

                          ₹
                          {formatCurrency(
                            quotation.grand_total
                          )}

                        </td>


                        {/* DATE */}

                        <td className="p-4">

                          {formatDate(
                            quotation.date
                          )}

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