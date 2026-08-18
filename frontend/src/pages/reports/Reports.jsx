import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

import ReportCards from "./ReportCards";
import ReportFilter from "./ReportFilter";
import BusinessInsights from "./BusinessInsights";
import RevenueOverview from "./RevenueOverview";
import MonthlyTrendChart from "./MonthlyTrendChart";
import FurnitureSalesChart from "./FurnitureSalesChart";
import RevenuePieChart from "./RevenuePieChart";
import TopCustomers from "./TopCustomers";
import TopFurniture from "./TopFurniture";
import RecentQuotations from "./RecentQuotations";
import ExportSection from "./ExportSection";

import { generateReportPDF } from "./reportPdf";
import { generateReportExcel } from "./reportExcel";

import {
  customerAPI,
  furnitureAPI,
  quotationAPI,
} from "../../services/api";

import toast from "react-hot-toast";

const Reports = () => {

  // ==========================================
  // STATE
  // ==========================================

  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [furniture, setFurniture] = useState([]);

  const [selectedFilter, setSelectedFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DATA FROM DJANGO / MYSQL
  // ==========================================

  useEffect(() => {

    const loadReportData = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          customerData,
          furnitureData,
          quotationData,
        ] = await Promise.all([

          customerAPI.getAll(),

          furnitureAPI.getAll(),

          quotationAPI.getAll(),

        ]);


        const customerList =
          Array.isArray(customerData)
            ? customerData
            : [];


        const furnitureList =
          Array.isArray(furnitureData)
            ? furnitureData
            : [];


        const quotationList =
          Array.isArray(quotationData)
            ? quotationData
            : [];


        // ======================================
        // CUSTOMER LOOKUP
        // ======================================

        const customerMap =
          customerList.reduce(
            (map, customer) => {

              map[customer.id] =
                customer;

              return map;

            },
            {}
          );


        // ======================================
        // FURNITURE LOOKUP
        // ======================================

        const furnitureMap =
          furnitureList.reduce(
            (map, item) => {

              map[item.id] =
                item;

              return map;

            },
            {}
          );


        // ======================================
        // NORMALIZE QUOTATIONS
        //
        // Existing report components were
        // written for the old localStorage
        // structure.
        //
        // We keep their expected fields while
        // using Django/MySQL as the source.
        // ======================================

        const normalizedQuotations =
          quotationList.map((quotation) => {

            const customer =
              customerMap[
                quotation.customer
              ];


            const normalizedItems =
              Array.isArray(
                quotation.items
              )
                ? quotation.items.map(
                    (item) => {

                      // API normally gives
                      // furniture_name directly.
                      const furnitureName =
                        item.furniture_name ||
                        item.furnitureName ||
                        furnitureMap[
                          item.furniture
                        ]?.name ||
                        "Unknown Furniture";


                      return {
                        ...item,

                        furnitureName,

                        furniture_name:
                          furnitureName,

                        amount:
                          Number(
                            item.amount || 0
                          ),

                        rate:
                          Number(
                            item.rate || 0
                          ),

                        qty:
                          Number(
                            item.qty || 0
                          ),

                        area:
                          Number(
                            item.area || 0
                          ),

                      };

                    }
                  )
                : [];


            return {

              ...quotation,

              // Old component compatibility
              grandTotal:
                Number(
                  quotation.grand_total || 0
                ),

              grand_total:
                Number(
                  quotation.grand_total || 0
                ),

              subtotal:
                Number(
                  quotation.subtotal || 0
                ),

              gst:
                Number(
                  quotation.gst || 0
                ),

              gstAmount:
                Number(
                  quotation.gst_amount || 0
                ),

              discount:
                Number(
                  quotation.discount || 0
                ),

              discountAmount:
                Number(
                  quotation.discount_amount || 0
                ),

              // Customer compatibility
              customerName:
                customer?.name ||
                quotation.customerName ||
                "Unknown Customer",

              customer_name:
                customer?.name ||
                quotation.customerName ||
                "Unknown Customer",

              phone:
                quotation.phone ||
                customer?.phone ||
                "",

              address:
                quotation.address ||
                customer?.address ||
                "",

              // Items
              items:
                normalizedItems,

              // Keep API date
              date:
                quotation.date,

            };

          });


        // ======================================
        // SET STATE
        // ======================================

        setCustomers(
          customerList
        );

        setFurniture(
          furnitureList
        );

        setQuotations(
          normalizedQuotations
        );


      } catch (err) {

        console.error(
          "Failed to load reports:",
          err
        );

        const message =
          err.message ||
          "Failed to load report data.";

        setError(message);

        toast.error(message);

      } finally {

        setLoading(false);

      }

    };


    loadReportData();

  }, []);


  // ==========================================
  // FILTER DATA
  // ==========================================

  const filteredQuotations =
    quotations.filter(
      (quotation) => {

        if (
          selectedFilter ===
          "all"
        ) {
          return true;
        }


        const quotationDate =
          new Date(
            quotation.date
          );


        const today =
          new Date();


        switch (
          selectedFilter
        ) {

          case "today":

            return (
              quotationDate.toDateString() ===
              today.toDateString()
            );


          case "week": {

            const lastWeek =
              new Date();

            lastWeek.setDate(
              today.getDate() - 7
            );

            return (
              quotationDate >=
              lastWeek
            );

          }


          case "month":

            return (
              quotationDate.getMonth() ===
                today.getMonth() &&
              quotationDate.getFullYear() ===
                today.getFullYear()
            );


          case "year":

            return (
              quotationDate.getFullYear() ===
              today.getFullYear()
            );


          default:

            return true;

        }

      }
    );


  // ==========================================
  // SUMMARY
  // ==========================================

  const totalRevenue =
    filteredQuotations.reduce(
      (sum, quotation) =>

        sum +
        Number(
          quotation.grand_total ||
          quotation.grandTotal ||
          0
        ),

      0
    );


  // ==========================================
  // EXPORT PDF
  // ==========================================

  const handleExportPDF = () => {

    generateReportPDF({

      quotations:
        filteredQuotations,

      customers,

      furniture,

      totalRevenue,

    });

  };


  // ==========================================
  // EXPORT EXCEL
  // ==========================================

  const handleExportExcel = () => {

    generateReportExcel({

      quotations:
        filteredQuotations,

      customers,

      furniture,

      totalRevenue,

    });

  };


  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {

    window.print();

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <MainLayout>

      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADING
        ===================================== */}

        <div className="mb-8">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold text-white">
                Reports
              </h1>

              <p className="text-slate-400 mt-2">
                Analyze your business performance,
                revenue and customer insights.
              </p>

            </div>

            {loading && (

              <span className="text-sm text-slate-400">
                Loading...
              </span>

            )}

          </div>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">

            {error}

          </div>

        )}


        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <ReportCards

          totalRevenue={
            totalRevenue
          }

          totalQuotations={
            filteredQuotations.length
          }

          totalCustomers={
            customers.length
          }

          totalFurniture={
            furniture.length
          }

        />


        {/* =====================================
            FILTER
        ===================================== */}

        <ReportFilter

          selectedFilter={
            selectedFilter
          }

          setSelectedFilter={
            setSelectedFilter
          }

        />


        {/* =====================================
            BUSINESS INSIGHTS
        ===================================== */}

        <BusinessInsights

          quotations={
            filteredQuotations
          }

        />


        {/* =====================================
            REVENUE SECTION
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <RevenueOverview

            quotations={
              filteredQuotations
            }

          />

          <MonthlyTrendChart

            quotations={
              filteredQuotations
            }

          />

        </div>


        {/* =====================================
            ANALYTICS
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <FurnitureSalesChart

            quotations={
              filteredQuotations
            }

          />

          <RevenuePieChart

            quotations={
              filteredQuotations
            }

          />

        </div>


        {/* =====================================
            RANKINGS
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <TopCustomers

            quotations={
              filteredQuotations
            }

          />

          <TopFurniture

            quotations={
              filteredQuotations
            }

          />

        </div>


        {/* =====================================
            RECENT QUOTATIONS
        ===================================== */}

        <div className="mt-10">

          <RecentQuotations

            quotations={
              filteredQuotations
            }

          />

        </div>


        {/* =====================================
            EXPORT SECTION
        ===================================== */}

        <div className="mt-10 mb-12">

          <ExportSection

            onExportPDF={
              handleExportPDF
            }

            onExportExcel={
              handleExportExcel
            }

            onPrint={
              handlePrint
            }

          />

        </div>

      </div>

    </MainLayout>

  );

};

export default Reports;