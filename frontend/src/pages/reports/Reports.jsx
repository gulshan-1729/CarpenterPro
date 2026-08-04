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

const Reports = () => {
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    setQuotations(
      JSON.parse(localStorage.getItem("quotationsV2")) || []
    );

    setCustomers(
      JSON.parse(localStorage.getItem("customers")) || []
    );

    setFurniture(
      JSON.parse(localStorage.getItem("furniture")) || []
    );
  }, []);

  // ==========================
  // FILTER DATA
  // ==========================

  const filteredQuotations = quotations.filter((quotation) => {
    if (selectedFilter === "all") return true;

    const quotationDate = new Date(quotation.date);
    const today = new Date();

    switch (selectedFilter) {
      case "today":
        return (
          quotationDate.toDateString() ===
          today.toDateString()
        );

      case "week": {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        return quotationDate >= lastWeek;
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
  });

  // ==========================
  // SUMMARY
  // ==========================

  const totalRevenue = filteredQuotations.reduce(
    (sum, quotation) =>
      sum + Number(quotation.grandTotal || 0),
    0
  );

  // ==========================
  // EXPORT PDF
  // ==========================

  const handleExportPDF = () => {
    generateReportPDF({
      quotations: filteredQuotations,
      customers,
      furniture,
      totalRevenue,
    });
  };

  // ==========================
  // EXPORT EXCEL
  // ==========================

  const handleExportExcel = () => {
    generateReportExcel({
      quotations: filteredQuotations,
      customers,
      furniture,
      totalRevenue,
    });
  };

  // ==========================
  // PRINT
  // ==========================

  const handlePrint = () => {
    window.print();
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white">
            Reports
          </h1>

          <p className="text-slate-400 mt-2">
            Analyze your business performance,
            revenue and customer insights.
          </p>

        </div>

        {/* Summary Cards */}

        <ReportCards
          totalRevenue={totalRevenue}
          totalQuotations={filteredQuotations.length}
          totalCustomers={customers.length}
          totalFurniture={furniture.length}
        />

        {/* Filter */}

        <ReportFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Business Insights */}

        <BusinessInsights
          quotations={filteredQuotations}
        />

        {/* Revenue Section */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <RevenueOverview
            quotations={filteredQuotations}
          />

          <MonthlyTrendChart
            quotations={filteredQuotations}
          />

        </div>

        {/* Analytics */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <FurnitureSalesChart
            quotations={filteredQuotations}
          />

          <RevenuePieChart
            quotations={filteredQuotations}
          />

        </div>

        {/* Rankings */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

          <TopCustomers
            quotations={filteredQuotations}
          />

          <TopFurniture
            quotations={filteredQuotations}
          />

        </div>

        {/* Recent Quotations */}

        <div className="mt-10">

          <RecentQuotations
            quotations={filteredQuotations}
          />

        </div>

        {/* Export Section */}

        <div className="mt-10 mb-12">

          <ExportSection
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onPrint={handlePrint}
          />

        </div>

      </div>
    </MainLayout>
  );
};

export default Reports;