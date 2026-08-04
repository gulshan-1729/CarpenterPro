import * as XLSX from "xlsx";

export const generateReportExcel = ({
  quotations,
  customers,
  furniture,
  totalRevenue,
}) => {

  // ===========================
  // SUMMARY
  // ===========================

  const summarySheet = [
    ["SHARMA INTERIORS & FURNITURE"],
    [],
    ["Business Report"],
    [],
    ["Generated On", new Date().toLocaleDateString()],
    [],
    ["Total Revenue", totalRevenue],
    ["Total Quotations", quotations.length],
    ["Total Customers", customers.length],
    ["Furniture Items", furniture.length],
  ];

  // ===========================
  // QUOTATIONS
  // ===========================

  const quotationSheet = quotations.map((quotation) => ({
    Invoice: quotation.invoiceNo,
    Customer: quotation.customerName,
    Phone: quotation.phone,
    Date: quotation.date,
    Items: quotation.items?.length || 0,
    GST: quotation.gst,
    Discount: quotation.discount,
    GrandTotal: quotation.grandTotal,
  }));

  // ===========================
  // CUSTOMERS
  // ===========================

  const customerSheet = customers.map((customer) => ({
    Name: customer.name,
    Phone: customer.phone,
    Address: customer.address,
  }));

  // ===========================
  // FURNITURE
  // ===========================

  const furnitureSheet = furniture.map((item) => ({
    Furniture: item.furnitureName,
    Rate: item.rate,
  }));

  // ===========================
  // CREATE WORKBOOK
  // ===========================

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(summarySheet),
    "Summary"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(quotationSheet),
    "Quotations"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(customerSheet),
    "Customers"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(furnitureSheet),
    "Furniture"
  );

  XLSX.writeFile(
    workbook,
    `Business_Report_${Date.now()}.xlsx`
  );
};