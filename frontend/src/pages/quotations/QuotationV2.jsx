import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { customerAPI, furnitureAPI, quotationAPI, companyAPI } from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const QuotationV2 = () => {
  // ==========================================
  // CUSTOMER DETAILS
  // ==========================================

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ID of the customer stored in Django/MySQL.
  // This is required when creating/updating a quotation.
  const [customerId, setCustomerId] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Saved furniture catalogue from Django/MySQL.
  // Used by quotation items for search suggestions and automatic rate filling.
  const [furnitureCatalog, setFurnitureCatalog] = useState([]);
  const [furnitureSuggestions, setFurnitureSuggestions] = useState({});

  const [loadingQuotations, setLoadingQuotations] = useState(true);
  const [savingQuotation, setSavingQuotation] = useState(false);

  // Company Settings
  // Backend/Django is the source of truth.
  const [company, setCompany] = useState({
    companyName: "Sharma Interiors & Furniture",
    ownerName: "",
    phone: "",
    email: "",
    website: "",
    gst: "",
    address: "",
    logo: "",
    signature: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    upiId: "",
    invoicePrefix: "CP",
    startingInvoice: 1,
    terms: "",
    footer: "Thank you for your business.",
  });

  // ==========================================
  // SEARCH / SORT
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ==========================================
  // TAX
  // ==========================================

  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0);

  const numberValue = (value) => Number(value || 0);

 const round = (value) => Number(Number(value || 0).toFixed(2));

  const recalculateItem = (item) => {
  let updated = { ...item };

  const length = numberValue(updated.length);
  const width = numberValue(updated.width);

  // Auto-calculate area only if user hasn't entered one
  if (updated.area === "" || updated.area === null) {
    updated.area = round(length * width);
  }

  // Auto-calculate amount
  if (updated.amount === "" || updated.amount === null) {
    updated.amount = round(
      numberValue(updated.area) *
      numberValue(updated.rate) *
      numberValue(updated.qty)
    );
  }

  return updated;
};

  // ==========================================
  // ITEMS
  // ==========================================

 const createEmptyItem = () => ({
  id: Date.now() + Math.random(),

  furnitureName: "",

  length: "",

  width: "",

  area: "",

  rate: "",

  qty: 1,

  amount: "",
});

  const [items, setItems] = useState([createEmptyItem()]);

  // ==========================================
  // QUOTATIONS
  // ==========================================

  const [quotations, setQuotations] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [selectedQuotation, setSelectedQuotation] =
    useState(null);

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);

  // ==========================================
  // BACKEND DATA HELPERS
  // ==========================================

  const formatQuotationDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const normalizeQuotation = (
    quotation,
    customerList = customers
  ) => {
    const linkedCustomer =
      customerList.find(
        (customer) =>
          customer.id === quotation.customer
      );

    return {
    id: quotation.id,
    invoiceNo: quotation.invoice_no,
    customerId: quotation.customer,
    customerName:
      quotation.customer_name ||
      quotation.customerName ||
      linkedCustomer?.name ||
      "",

    phone: quotation.phone || "",
    address: quotation.address || "",

    items: (quotation.items || []).map((item) => ({
      id: item.id ?? Date.now() + Math.random(),
      furnitureName:
        item.furniture_name ||
        item.furnitureName ||
        "",
      length: numberValue(item.length),
      width: numberValue(item.width),
      area: numberValue(item.area),
      rate: numberValue(item.rate),
      qty: numberValue(item.qty),
      amount: numberValue(item.amount),
    })),

    gst: numberValue(quotation.gst),
    discount: numberValue(quotation.discount),
    subtotal: numberValue(quotation.subtotal),
    gstAmount: numberValue(
      quotation.gst_amount ?? quotation.gstAmount
    ),
    discountAmount: numberValue(
      quotation.discount_amount ??
        quotation.discountAmount
    ),
    grandTotal: numberValue(
      quotation.grand_total ??
        quotation.grandTotal
    ),

    date: formatQuotationDate(quotation.date),
    rawDate: quotation.date,
    };
  };

  const loadBackendData = async () => {
    try {
      setLoadingQuotations(true);

      const [customerData, furnitureData, quotationData] =
        await Promise.all([
          customerAPI.getAll(),
          furnitureAPI.getAll(),
          quotationAPI.getAll(),
        ]);

      setCustomers(customerData || []);
      setFurnitureCatalog(furnitureData || []);

      setQuotations(
        (quotationData || []).map(
          (quotation) =>
            normalizeQuotation(
              quotation,
              customerData || []
            )
        )
      );
    } catch (error) {
      console.error(
        "Failed to load quotation data:",
        error
      );

      alert(
        error.message ||
          "Failed to load quotation data."
      );
    } finally {
      setLoadingQuotations(false);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, []);

  useEffect(() => {
    let mounted = true;

    const normalizeCompany = (data) => ({
      companyName: data?.company_name || data?.companyName || "Sharma Interiors & Furniture",
      ownerName: data?.owner_name || data?.ownerName || "",
      phone: data?.phone || "",
      email: data?.email || "",
      website: data?.website || "",
      gst: data?.gst || "",
      address: data?.address || "",
      logo: data?.logo || "",
      signature: data?.signature || "",
      bankName: data?.bank_name || data?.bankName || "",
      accountNumber: data?.account_number || data?.accountNumber || "",
      ifsc: data?.ifsc || "",
      upiId: data?.upi_id || data?.upiId || "",
      invoicePrefix: data?.invoice_prefix || data?.invoicePrefix || "CP",
      startingInvoice: Number(data?.starting_invoice ?? data?.startingInvoice ?? 1),
      terms: data?.terms || "",
      footer: data?.footer || "Thank you for your business.",
    });

    const loadCompany = async () => {
      try {
        const data = await companyAPI.get();
        if (mounted) {
          setCompany(normalizeCompany(data));
        }
      } catch (error) {
        console.error("Failed to load company profile from backend:", error);

        // Fallback only if the backend is temporarily unavailable.
        try {
          const saved = localStorage.getItem("companyProfile");
          if (saved && mounted) {
            setCompany(normalizeCompany(JSON.parse(saved)));
          }
        } catch (fallbackError) {
          console.error("Failed to load local company profile:", fallbackError);
        }
      }
    };

    loadCompany();

    const handleCompanyUpdated = () => {
      loadCompany();
    };

    window.addEventListener("companyProfileUpdated", handleCompanyUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("companyProfileUpdated", handleCompanyUpdated);
    };
  }, []);

  // ==========================================
  // ITEM FUNCTIONS
  // ==========================================

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const insertItemAfter = (id) => {

  setItems((prev) => {

    const index = prev.findIndex(
      (item) => item.id === id
    );

    if (index === -1) return prev;

    const updated = [...prev];

    updated.splice(
      index + 1,
      0,
      createEmptyItem()
    );

    return updated;

  });

};

  const removeItem = (id) => {
    if (items.length === 1) {
      alert("At least one furniture item is required.");
      return;
    }

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const handleItemChange = (id, field, value) => {

    setItems((prev) =>
      prev.map((item) => {

        if (item.id !== id) return item;

        let updated = {
          ...item,
          [field]: value,
        };

        // -------------------------
        // Furniture Name Changed
        // -------------------------

        if (field === "furnitureName") {
          const searchValue = String(value || "").trim();

          const filtered = furnitureCatalog.filter((furniture) =>
            furniture.name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );

          setFurnitureSuggestions((prevSuggestions) => ({
            ...prevSuggestions,
            [id]: searchValue ? filtered : [],
          }));

          // If the user types an exact saved furniture name,
          // automatically use its saved rate.
          const matchedFurniture = furnitureCatalog.find(
            (furniture) =>
              furniture.name.toLowerCase() ===
              searchValue.toLowerCase()
          );

          if (matchedFurniture) {
            updated.rate = numberValue(matchedFurniture.rate);

            updated.amount = round(
              numberValue(updated.area) *
                numberValue(matchedFurniture.rate) *
                numberValue(updated.qty)
            );
          }

          return updated;
        }

        // -------------------------
        // Length / Width Changed
        // -------------------------

        if (field === "length" || field === "width") {

          updated.length = numberValue(updated.length);
          updated.width = numberValue(updated.width);

          updated.area = round(
            updated.length * updated.width
          );

          updated.amount = round(
            updated.area *
              numberValue(updated.rate) *
              numberValue(updated.qty)
          );

          return updated;
        }

        // -------------------------
        // Area Edited
        // -------------------------

        if (field === "area") {

          updated.area = round(value);

          updated.amount = round(
            numberValue(updated.area) *
              numberValue(updated.rate) *
              numberValue(updated.qty)
          );

          return updated;
        }

        // -------------------------
        // Rate Changed
        // -------------------------

        if (field === "rate") {

          updated.rate = numberValue(value);

          updated.amount = round(
            numberValue(updated.area) *
              updated.rate *
              numberValue(updated.qty)
          );

          return updated;
        }

        // -------------------------
        // Qty Changed
        // -------------------------

        if (field === "qty") {

          updated.qty = numberValue(value);

          updated.amount = round(
            numberValue(updated.area) *
              numberValue(updated.rate) *
              updated.qty
          );

          return updated;
        }

        // -------------------------
        // Amount Edited
        // -------------------------

        if (field === "amount") {

          updated.amount = round(value);

          return updated;
        }

        return updated;

      })
    );

  };

  const selectFurniture = (itemId, furniture) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const rate = numberValue(furniture.rate);

        return {
          ...item,
          furnitureName: furniture.name,
          rate,
          amount: round(
            numberValue(item.area) *
              rate *
              numberValue(item.qty)
          ),
        };
      })
    );

    setFurnitureSuggestions((prev) => ({
      ...prev,
      [itemId]: [],
    }));
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

const subtotal = items.reduce(
  (sum, item) => sum + numberValue(item.amount),
  0
);

const totalArea = items.reduce(
  (sum, item) => sum + numberValue(item.area),
  0
);

const gstAmount = subtotal * (gst / 100);

const discountAmount =
  subtotal * (discount / 100);

const grandTotal =
  subtotal + gstAmount - discountAmount;

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setCustomerId(null);
    setCustomerName("");
    setPhone("");
    setAddress("");

    setGst(0);
    setDiscount(0);

    setEditingId(null);

    setSuggestions([]);

    setItems([createEmptyItem()]);
  };

  const cancelEdit = () => {

  setEditingId(null);

  resetForm();

};

  // ==========================================
  // SAVE QUOTATION
  // ==========================================

  const saveQuotation = async () => {
    if (savingQuotation) return;

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter phone number");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits");
      return;
    }

    if (!address.trim()) {
      alert("Please enter address");
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !item.furnitureName ||
        Number(item.length) <= 0 ||
        Number(item.width) <= 0 ||
        Number(item.area) <= 0 ||
        Number(item.rate) <= 0 ||
        Number(item.qty) <= 0 ||
        Number(item.amount) <= 0
    );

    if (invalidItem) {
      alert(
        "Please fill all furniture item details correctly."
      );
      return;
    }

    setSavingQuotation(true);

    try {
      // ----------------------------------------
      // Find the existing customer.
      // If this quotation uses a new customer,
      // create that customer through Django first.
      // ----------------------------------------

      let selectedCustomer = customers.find(
        (customer) =>
          customer.id === customerId
      );

      if (!selectedCustomer) {
        selectedCustomer = customers.find(
          (customer) =>
            String(customer.phone) ===
            String(phone)
        );
      }

      if (!selectedCustomer) {
        selectedCustomer = await customerAPI.create({
          name: customerName.trim(),
          phone: phone.trim(),
          email: "",
          address: address.trim(),
        });

        setCustomers((prev) => [
          selectedCustomer,
          ...prev,
        ]);
      } else {
        // Keep the quotation customer information
        // synchronized with the selected customer.
        if (
          selectedCustomer.name !==
            customerName.trim() ||
          selectedCustomer.phone !==
            phone.trim() ||
          (selectedCustomer.address || "") !==
            address.trim()
        ) {
          selectedCustomer =
            await customerAPI.update(
              selectedCustomer.id,
              {
                name: customerName.trim(),
                phone: phone.trim(),
                address: address.trim(),
              }
            );

          setCustomers((prev) =>
            prev.map((customer) =>
              customer.id ===
              selectedCustomer.id
                ? selectedCustomer
                : customer
            )
          );
        }
      }

      setCustomerId(selectedCustomer.id);

      // ----------------------------------------
      // Invoice number
      // ----------------------------------------

      const currentYear = new Date().getFullYear();
      const invoicePrefix = String(company.invoicePrefix || "CP")
        .trim()
        .toUpperCase();
      const startingInvoice = Math.max(
        1,
        Number(company.startingInvoice || 1)
      );

      const invoicePattern = new RegExp(
        `^${invoicePrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-${currentYear}-(\\d+)$`,
        "i"
      );

      const maxInvoice = quotations.reduce((max, quotation) => {
        const match = String(quotation.invoiceNo || "").match(invoicePattern);
        if (!match) return max;

        const number = Number(match[1]);
        return Number.isFinite(number) && number > max ? number : max;
      }, startingInvoice - 1);

      const existingQuotation = editingId
        ? quotations.find((quotation) => quotation.id === editingId)
        : null;

      const invoiceNo =
        existingQuotation?.invoiceNo ||
        `${invoicePrefix}-${currentYear}-${String(maxInvoice + 1).padStart(4, "0")}`;

      // ----------------------------------------
      // Prepare quotation items for Django.
      // Do NOT send the frontend-only item ID.
      // ----------------------------------------

      const processedItems = items.map(
        (item) => ({
          furniture_name:
            item.furnitureName.trim(),
          length: numberValue(item.length),
          width: numberValue(item.width),
          area: numberValue(item.area),
          rate: numberValue(item.rate),
          qty: numberValue(item.qty),
          amount: numberValue(item.amount),
        })
      );

      // ----------------------------------------
      // Django quotation payload
      // ----------------------------------------

      const quotationPayload = {
        invoice_no: invoiceNo,
        customer: selectedCustomer.id,
        phone: phone.trim(),
        address: address.trim(),

        gst: round(gst),
        discount: round(discount),

        subtotal: round(subtotal),

        gst_amount: round(gstAmount),

        discount_amount:
          round(discountAmount),

        grand_total: round(grandTotal),

        items: processedItems,
      };

      // ----------------------------------------
      // CREATE
      // ----------------------------------------

      if (!editingId) {
        const created =
          await quotationAPI.create(
            quotationPayload
          );

        const normalized =
          normalizeQuotation(created);

        setQuotations((prev) => [
          normalized,
          ...prev,
        ]);

        setSelectedQuotation(normalized);

        alert(
          "Quotation saved successfully"
        );
      }

      // ----------------------------------------
      // UPDATE
      // ----------------------------------------

      else {
        const updated =
          await quotationAPI.update(
            editingId,
            quotationPayload
          );

        const normalized =
          normalizeQuotation(updated);

        setQuotations((prev) =>
          prev.map((quotation) =>
            quotation.id === editingId
              ? normalized
              : quotation
          )
        );

        setSelectedQuotation(normalized);

        alert(
          "Quotation updated successfully"
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Quotation save failed:",
        error
      );

      alert(
        error.message ||
          "Failed to save quotation."
      );
    } finally {
      setSavingQuotation(false);
    }
  };

  // ==========================================
  // EDIT / DELETE
  // ==========================================

  const handleEdit = (quotation) => {
    setEditingId(quotation.id);

    setCustomerId(
      quotation.customerId || null
    );

    setCustomerName(
      quotation.customerName
    );

    setPhone(quotation.phone);
    setAddress(quotation.address);

    setItems(
      quotation.items.map((item) => ({
        ...item,

        area:
          item.area ??
          round(
            numberValue(item.length) *
              numberValue(item.width)
          ),

        amount:
          item.amount ??
          round(
            (item.area ??
              numberValue(item.length) *
                numberValue(item.width)) *
              numberValue(item.rate) *
              numberValue(item.qty)
          ),
      }))
    );

    setGst(quotation.gst);
    setDiscount(quotation.discount);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this quotation?"
      )
    ) {
      return;
    }

    try {
      await quotationAPI.delete(id);

      setQuotations((prev) =>
        prev.filter(
          (quotation) =>
            quotation.id !== id
        )
      );

      if (
        selectedQuotation?.id === id
      ) {
        setSelectedQuotation(null);
        setShowInvoiceModal(false);
      }

      if (editingId === id) {
        resetForm();
      }

      alert(
        "Quotation deleted successfully"
      );
    } catch (error) {
      console.error(
        "Quotation delete failed:",
        error
      );

      alert(
        error.message ||
          "Failed to delete quotation."
      );
    }
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  const totalRevenue = quotations.reduce(
    (sum, quotation) =>
      sum + Number(quotation.grandTotal || 0),
    0
  );

  const averageQuotation =
    quotations.length > 0
      ? totalRevenue / quotations.length
      : 0;

  const filteredQuotations = [...quotations]
    .filter(
      (quotation) =>
        quotation.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        quotation.invoiceNo
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.id - b.id;

        case "highest":
          return (
            Number(b.grandTotal) -
            Number(a.grandTotal)
          );

        case "lowest":
          return (
            Number(a.grandTotal) -
            Number(b.grandTotal)
          );

        default:
          return b.id - a.id;
      }
    });

  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout>

            <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-6">
          Smart Quotation
        </h1>

        <div className="bg-slate-900 rounded-3xl p-6">

          {/* ==========================================
              CUSTOMER DETAILS
          ========================================== */}

          <h2 className="text-xl font-bold text-white mb-4">
            Customer Details
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="relative">

              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => {
                  const value = e.target.value;

                  setCustomerName(value);

                  const matchedCustomer =
                    customers.find(
                      (customer) =>
                        customer.name.toLowerCase() ===
                        value.trim().toLowerCase()
                    );

                  setCustomerId(
                    matchedCustomer?.id || null
                  );

                  const filtered = customers.filter((customer) =>
                    customer.name
                      .toLowerCase()
                      .includes(value.toLowerCase())
                  );

                  setSuggestions(value ? filtered : []);
                }}
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />

              {suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">

                  {suggestions.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-3 cursor-pointer hover:bg-slate-600 text-white"
                      onClick={() => {
                        setCustomerId(customer.id);
                        setCustomerName(customer.name);
                        setPhone(customer.phone);
                        setAddress(customer.address || "");
                        setSuggestions([]);
                      }}
                    >
                      {customer.name}
                    </div>
                  ))}

                </div>
              )}

            </div>

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              className="p-4 rounded-xl bg-slate-800 text-white"
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="p-4 rounded-xl bg-slate-800 text-white"
            />

          </div>

          {/* ==========================================
              FURNITURE ITEMS
          ========================================== */}

          <div className="mt-8">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-bold text-white">
                Furniture Items
              </h2>

              <button
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white"
              >
                + Add Item
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full bg-slate-800 rounded-xl">

                <thead>

                  <tr className="bg-slate-700 text-white">

                    <th className="p-3">Furniture</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Width</th>
                    <th className="p-3">Rate</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Area</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Action</th>

                  </tr>

                </thead>

                <tbody>

                  {items.map((item) => {

                    return (

                      <tr
                        key={item.id}
                        className="border-t border-slate-700 text-white"
                      >

                        <td className="p-3">
                          <div className="relative">

                            <input
                              type="text"
                              value={item.furnitureName}
                              placeholder="Furniture Name"
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  "furnitureName",
                                  e.target.value
                                )
                              }
                              onFocus={() => {
                                const value = String(
                                  item.furnitureName || ""
                                ).trim();

                                const filtered = value
                                  ? furnitureCatalog.filter((furniture) =>
                                      furniture.name
                                        .toLowerCase()
                                        .includes(value.toLowerCase())
                                    )
                                  : furnitureCatalog;

                                setFurnitureSuggestions((prev) => ({
                                  ...prev,
                                  [item.id]: filtered,
                                }));
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  setFurnitureSuggestions((prev) => ({
                                    ...prev,
                                    [item.id]: [],
                                  }));
                                }, 150);
                              }}
                              className="w-full p-2 rounded-lg bg-slate-900"
                            />

                            {furnitureSuggestions[item.id]?.length > 0 && (
                              <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto border border-slate-600">

                                {furnitureSuggestions[item.id].map(
                                  (furniture) => (
                                    <button
                                      type="button"
                                      key={furniture.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectFurniture(
                                          item.id,
                                          furniture
                                        );
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-slate-600 text-white border-b border-slate-600 last:border-b-0"
                                    >
                                      <div className="font-medium">
                                        {furniture.name}
                                      </div>

                                      <div className="text-xs text-slate-300">
                                        ₹
                                        {Number(
                                          furniture.rate
                                        ).toLocaleString("en-IN")}
                                        {" / "}
                                        {furniture.unit === "sqft"
                                          ? "sq.ft"
                                          : furniture.unit === "piece"
                                            ? "piece"
                                            : furniture.unit === "running_ft"
                                              ? "running ft"
                                              : furniture.unit || "unit"}
                                      </div>
                                    </button>
                                  )
                                )}

                              </div>
                            )}

                          </div>
                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.length}
                            placeholder="Length"
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "length",
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded-lg bg-slate-900 text-white"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.width}
                            placeholder="Width"
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "width",
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded-lg bg-slate-900 text-white"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.rate}
                            placeholder="Rate"
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "rate",
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded-lg bg-slate-900 text-white"
                          />

                        </td>

                        <td className="p-3">

                          <input
                            type="number"
                            value={item.qty}
                            placeholder="Qty"
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "qty",
                                e.target.value
                              )
                            }
                            className="w-full p-2 rounded-lg bg-slate-900 text-white"
                          />

                        </td>

                      <td className="p-3">

                        <input
                         type="number"
                         value={item.area}
                         placeholder="Area"
                         onChange={(e) =>
                         handleItemChange(
                         item.id,
                         "area",
                         e.target.value
                        )
                         }
                           className="w-full p-2 rounded-lg bg-slate-900 text-green-400 font-semibold"
                        />

                        </td>

                      <td className="p-3">

                        <input
                        type="number"
                        value={item.amount}
                        placeholder="Amount"
                        onChange={(e) =>
                        handleItemChange(
                        item.id,
                        "amount",
                        e.target.value
                        )
                        }
                       className="w-full p-2 rounded-lg bg-slate-900 text-amber-400 font-semibold"
                      />

                      </td>

                        <td className="p-3">

                         <div className="flex gap-2">

                          <button
                          onClick={() => insertItemAfter(item.id)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
                          >
                             +
                          </button>

                          <button
                           onClick={() => removeItem(item.id)}
                           className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                           >
                           Delete
                          </button>

                          </div>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* ==========================================
              GST & DISCOUNT
          ========================================== */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div>

              <label className="block mb-2 text-slate-400">
                GST (%)
              </label>

              <input
                type="number"
                value={gst}
                onChange={(e) =>
                  setGst(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />

            </div>

            <div>

              <label className="block mb-2 text-slate-400">
                Discount (%)
              </label>

              <input
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />

            </div>

          </div>

                    {/* ==========================================
              TOTAL CARDS
          ========================================== */}

          <div className="grid md:grid-cols-4 gap-4 mt-8">

            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-slate-400">Subtotal</p>

              <p className="text-2xl font-bold text-white">
                ₹
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-slate-400">
                GST Amount
              </p>

              <p className="text-2xl font-bold text-purple-400">
                ₹
                {gstAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl">
              <p className="text-slate-400">
                Discount
              </p>

              <p className="text-2xl font-bold text-red-400">
                ₹
                {discountAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-green-500">
              <p className="text-slate-400">
                Grand Total
              </p>

              <p className="text-2xl font-bold text-green-400">
                ₹
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

          </div>

          {/* ==========================================
              ACTION BUTTONS
          ========================================== */}

          <div className="flex gap-4 mt-8">

           {editingId ? (
  <>
    <button
      onClick={saveQuotation}
      disabled={savingQuotation}
      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-white"
    >
      {savingQuotation ? "Updating..." : "Update Quotation"}
    </button>

    <button
      onClick={cancelEdit}
      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white"
    >
      Cancel
    </button>
  </>
) : (
  <>
    <button
      onClick={saveQuotation}
      disabled={savingQuotation}
      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-white"
    >
      {savingQuotation ? "Saving..." : "Save Quotation"}
    </button>

    <button
      onClick={resetForm}
      className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl text-white"
    >
      Reset
    </button>
  </>
)}

          </div>

          {/* ==========================================
              QUOTATION HISTORY
          ========================================== */}

          <div className="mt-12">

            {/* Dashboard Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

              <div className="bg-slate-800 p-5 rounded-xl">
                <p className="text-slate-400">
                  Total Quotations
                </p>

                <h3 className="text-3xl font-bold text-white">
                  {quotations.length}
                </h3>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl">
                <p className="text-slate-400">
                  Total Revenue
                </p>

                <h3 className="text-3xl font-bold text-green-400">
                  ₹
                  {totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>

              <div className="bg-slate-800 p-5 rounded-xl">
                <p className="text-slate-400">
                  Average Quote
                </p>

                <h3 className="text-3xl font-bold text-blue-400">
                  ₹
                  {averageQuotation.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
                </h3>
              </div>

            </div>

            {/* Search & Sort */}

            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">

              <input
                type="text"
                placeholder="Search Customer or Invoice..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="bg-slate-800 text-white px-4 py-3 rounded-xl w-full md:w-80"
              />

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="bg-slate-800 text-white px-4 py-3 rounded-xl"
              >
                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

                <option value="highest">
                  Highest Amount
                </option>

                <option value="lowest">
                  Lowest Amount
                </option>

              </select>

            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Quotation History
            </h2>

                        <div className="overflow-x-auto">

              <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

                <thead>

                  <tr className="bg-slate-700 text-white">

                    <th className="p-3 text-left">
                      Invoice
                    </th>

                    <th className="p-3 text-left">
                      Customer
                    </th>

                    <th className="p-3 text-left">
                      Phone
                    </th>

                    <th className="p-3 text-left">
                      Date
                    </th>

                    <th className="p-3 text-left">
                      Total
                    </th>

                    <th className="p-3 text-left">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loadingQuotations ? (

                    <tr>
                      <td
                        colSpan="6"
                        className="p-6 text-center text-slate-400"
                      >
                        Loading quotations...
                      </td>
                    </tr>

                  ) : quotations.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="p-6 text-center text-slate-400"
                      >
                        No quotations found
                      </td>

                    </tr>

                  ) : (

                    filteredQuotations.map(
                      (quotation) => (

                        <tr
                          key={quotation.id}
                          className="border-t border-slate-700 text-white"
                        >

                          <td className="p-3">
                            {quotation.invoiceNo}
                          </td>

                          <td className="p-3">
                            {quotation.customerName}
                          </td>

                          <td className="p-3">
                            {quotation.phone}
                          </td>

                          <td className="p-3">
                            {quotation.date}
                          </td>

                          <td className="p-3 text-green-400 font-semibold">
                            ₹
                            {Number(
                              quotation.grandTotal
                            ).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>

                          <td className="p-3 flex gap-2 flex-wrap">

                            <button
                              onClick={() =>
                                handleEdit(
                                  quotation
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  quotation.id
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                            >
                              Delete
                            </button>

                            <button
                              onClick={() => {
                                setSelectedQuotation(
                                  quotation
                                );
                                setShowInvoiceModal(
                                  true
                                );
                              }}
                              className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg"
                            >
                              View Invoice
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          INVOICE MODAL
      ========================================== */}

      {showInvoiceModal &&
        selectedQuotation && (

          <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4">

            <div className="bg-white text-black rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">

              <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-3xl font-bold">
                   {company.companyName || "Invoice"}
                </h2>

                  {company.ownerName && (
                  <p className="text-sm text-slate-600 mt-1">
                  {company.ownerName}
                  </p>
                 )}
                </div>

                <button
                  onClick={() =>
                    setShowInvoiceModal(false)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>

              </div>

              <div className="mb-6 border-b pb-4">

  <div className="flex items-start gap-4">

    {company.logo && (
      <img
        src={company.logo}
        alt="Company Logo"
        className="w-24 h-20 object-contain"
      />
    )}

    <div>
      {company.phone && (
        <p className="text-sm">
          <strong>Phone:</strong>{" "}
          {company.phone}
        </p>
      )}

      {company.email && (
        <p className="text-sm">
          <strong>Email:</strong>{" "}
          {company.email}
        </p>
      )}

      {company.gst && (
        <p className="text-sm">
          <strong>GST:</strong>{" "}
          {company.gst}
        </p>
      )}

      {company.address && (
        <p className="text-sm">
          <strong>Address:</strong>{" "}
          {company.address}
        </p>
      )}
    </div>

  </div>

</div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <div>

                  <p>
                    <strong>
                      Invoice No:
                    </strong>{" "}
                    {
                      selectedQuotation.invoiceNo
                    }
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedQuotation.date}
                  </p>

                </div>

                <div>

                  <p>
                    <strong>
                      Customer:
                    </strong>{" "}
                    {
                      selectedQuotation.customerName
                    }
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {
                      selectedQuotation.phone
                    }
                  </p>

                  <p>
                    <strong>
                      Address:
                    </strong>{" "}
                    {
                      selectedQuotation.address
                    }
                  </p>

                </div>

              </div>

                <table className="w-full border mb-6">

                <thead>

                <tr className="bg-slate-200">

                <th className="border p-2">
                 Furniture
                 </th>

                <th className="border p-2">
                   L × W
                </th>

                <th className="border p-2">
                 Area
                </th>

                <th className="border p-2">
                Qty
                </th>

                <th className="border p-2">
                Rate
                </th>

                <th className="border p-2">
                 Amount
               </th>

                </tr>

                </thead>

                <tbody>

  {selectedQuotation.items.map((item) => (

    <tr key={item.id}>

      <td className="border p-2">
        {item.furnitureName}
      </td>

      <td className="border p-2">
        {item.length} × {item.width}
      </td>

      <td className="border p-2">
        {Number(item.area).toFixed(2)}
      </td>

      <td className="border p-2">
        {item.qty}
      </td>

      <td className="border p-2">
        ₹
        {Number(item.rate).toLocaleString("en-IN")}
      </td>

      <td className="border p-2">
        ₹
        {Number(item.amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>

    </tr>

  ))}

</tbody>

              </table>

              <div className="flex justify-end">

                <div className="w-80 space-y-2">

                  <p>
                    <strong>Subtotal:</strong>{" "}
                    ₹
                    {Number(
                      selectedQuotation.subtotal
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                  <p>
                    <strong>GST:</strong>{" "}
                    ₹
                    {Number(
                      selectedQuotation.gstAmount
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                  <p>
                    <strong>Discount:</strong>{" "}
                    ₹
                    {Number(
                      selectedQuotation.discountAmount
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                  <p className="text-2xl font-bold text-green-600">
                    Grand Total: ₹
                    {Number(
                      selectedQuotation.grandTotal
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                </div>

              </div>

              {/* ==========================================
                  PDF GENERATOR
              ========================================== */}

              <div className="mt-8">

                <button
                 onClick={() => {

  const pdf = new jsPDF();

  // =====================================
// COMPANY LOGO
// =====================================

if (company.logo) {
  try {
    pdf.addImage(
      company.logo,
      "PNG",
      14,
      8,
      25,
      25
    );
  } catch (error) {
    console.error(
      "Unable to add company logo:",
      error
    );
  }
}

  // =====================================
  // COMPANY HEADER
  // =====================================

  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);

  pdf.text(
    company.companyName || "Company Name",
    45,
    20
  );

  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);

  if (company.ownerName) {
    pdf.text(
      `Owner: ${company.ownerName}`,
      45,
      27
    );
  }

  pdf.setFontSize(10);

  if (company.phone) {
    pdf.text(
      `Phone: ${company.phone}`,
      45,
      35
    );
  }

  if (company.email) {
    pdf.text(
      `Email: ${company.email}`,
      45,
      41
    );
  }

  if (company.website) {
    pdf.text(
      `Website: ${company.website}`,
      45,
      47
    );
  }

  if (company.gst) {
    pdf.text(
      `GST: ${company.gst}`,
      45,
      53
    );
  }

  if (company.address) {

    const addressLines =
      pdf.splitTextToSize(
        `Address: ${company.address}`,
        115
      );

    pdf.text(
      addressLines,
      45,
      59
    );
  }


  // =====================================
  // INVOICE HEADER BOX
  // =====================================

  pdf.setFillColor(
    75,
    55,
    120
  );

  pdf.rect(
    140,
    15,
    55,
    8,
    "F"
  );

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.setFontSize(10);

  pdf.text(
    "QUOTATION",
    157,
    21
  );

  pdf.setTextColor(
    0,
    0,
    0
  );

  pdf.rect(
    140,
    23,
    55,
    30
  );

  pdf.line(
    140,
    38,
    195,
    38
  );

  pdf.text(
    `Invoice No: ${selectedQuotation.invoiceNo}`,
    145,
    32
  );

  pdf.text(
    `Date: ${selectedQuotation.date}`,
    145,
    47
  );


  // =====================================
  // CUSTOMER DETAILS
  // =====================================

  pdf.rect(
    14,
    60,
    90,
    40
  );

  pdf.setFontSize(12);

  pdf.text(
    "Customer Details",
    18,
    68
  );

  pdf.setFontSize(10);

  pdf.text(
    `Name: ${selectedQuotation.customerName}`,
    18,
    77
  );

  pdf.text(
    `Phone: ${selectedQuotation.phone}`,
    18,
    84
  );

  const customerAddressLines =
    pdf.splitTextToSize(
      `Address: ${selectedQuotation.address}`,
      80
    );

  pdf.text(
    customerAddressLines,
    18,
    91
  );


  // =====================================
  // QUOTATION TABLE
  // =====================================

  const tableRows =
    selectedQuotation.items.map(
      (item) => [

        item.furnitureName,

        `${item.length} × ${item.width}`,

        Number(item.area).toFixed(2),

        Number(item.qty),

        `Rs. ${Number(
          item.rate
        ).toLocaleString("en-IN")}`,

        `Rs. ${Number(
          item.amount
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,

      ]
    );


  autoTable(pdf, {

    startY: 110,

    head: [[
      "Furniture",
      "L × W",
      "Area",
      "Qty",
      "Rate",
      "Amount",
    ]],

    body: tableRows,

    theme: "striped",

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },

    headStyles: {
      fillColor: [
        75,
        55,
        120,
      ],

      textColor: 255,

      fontStyle: "bold",
    },

    alternateRowStyles: {
      fillColor: [
        245,
        245,
        245,
      ],
    },

  });


  // =====================================
  // FINAL TABLE POSITION
  // =====================================

  const finalY =
    (pdf.lastAutoTable?.finalY || 120) + 10;

                    // ==========================================
                    // TOTALS BOX
                    // ==========================================

                    autoTable(pdf, {
                      startY: finalY,

                      body: [
                        [
                          "Subtotal",
                          `Rs. ${Number(
                            selectedQuotation.subtotal
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                        ],
                        [
                          "GST",
                          `Rs. ${Number(
                            selectedQuotation.gstAmount
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                        ],
                        [
                          "Discount",
                          `Rs. ${Number(
                            selectedQuotation.discountAmount
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                        ],
                        [
                          "Grand Total",
                          `Rs. ${Number(
                            selectedQuotation.grandTotal
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`,
                        ],
                      ],

                      theme: "grid",

                      tableWidth: 110,

                      margin: {
                        left: 85,
                      },

                      styles: {
                        fontSize: 11,
                      },

                      columnStyles: {
                        0: {
                          fontStyle: "bold",
                        },
                        1: {
                          halign: "right",
                        },
                      },

                      didParseCell: (data) => {
                        if (data.row.index === 3) {
                          data.cell.styles.fontSize = 13;
                          data.cell.styles.fontStyle = "bold";
                          data.cell.styles.textColor = [
                            0,
                            128,
                            0,
                          ];
                        }
                      },
                    });

                    // ==========================================
                    // BANK DETAILS / TERMS
                    // ==========================================

                    let detailsY =
                      (pdf.lastAutoTable?.finalY || finalY) + 10;

                    if (company.bankName || company.accountNumber || company.ifsc || company.upiId) {
                      pdf.setFontSize(10);
                      pdf.setFont("helvetica", "bold");
                      pdf.text("Bank Details", 14, detailsY);
                      pdf.setFont("helvetica", "normal");

                      const bankLines = [];
                      if (company.bankName) bankLines.push(`Bank: ${company.bankName}`);
                      if (company.accountNumber) bankLines.push(`Account No: ${company.accountNumber}`);
                      if (company.ifsc) bankLines.push(`IFSC: ${company.ifsc}`);
                      if (company.upiId) bankLines.push(`UPI ID: ${company.upiId}`);

                      pdf.text(bankLines, 14, detailsY + 7);
                      detailsY += 7 + bankLines.length * 5;
                    }

                    if (company.terms?.trim()) {
                      pdf.setFontSize(10);
                      pdf.setFont("helvetica", "bold");
                      pdf.text("Terms & Conditions", 14, detailsY + 4);
                      pdf.setFont("helvetica", "normal");
                      pdf.setFontSize(8.5);

                      const termLines = pdf.splitTextToSize(company.terms.trim(), 175);
                      pdf.text(termLines, 14, detailsY + 11);
                      detailsY += 11 + termLines.length * 4.5;
                    }

                    // ==========================================
                    // SIGNATURE
                    // ==========================================

                    const signY = detailsY + 18;

// =====================================
// COMPANY SIGNATURE
// =====================================

if (company.signature) {
  try {
    pdf.addImage(
      company.signature,
      "PNG",
      155,
      signY - 18,
      35,
      20
    );
  } catch (error) {
    console.error(
      "Unable to add company signature:",
      error
    );
  }
}

                    pdf.line(
                      130,
                      signY,
                      190,
                      signY
                    );

                    pdf.setFontSize(10);

                    pdf.text(
                      `For ${company.companyName || "Company"}`,
                      132,
                      signY + 15
                    );

                    pdf.setFontSize(9);

                    pdf.text(
                      "Authorized Signatory",
                      145,
                      signY + 25
                    );

                    // Footer

                    pdf.setFontSize(10);

                    const footerText =
                      company.footer ||
                      `Thank You For Choosing ${company.companyName || "our company"}`;

                    pdf.setFontSize(9);
                    const footerLines = pdf.splitTextToSize(footerText, 170);
                    pdf.text(footerLines, 105, 270, { align: "center" });

                    if (company.phone) {
                      pdf.text(
                        `For Queries Contact: ${company.phone}`,
                        105,
                        277,
                        { align: "center" }
                      );
                    }

                    pdf.save(
                      `${selectedQuotation.invoiceNo}.pdf`
                    );

                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                >
                  Download PDF
                </button>

              </div>

            </div>

          </div>

        )}

    </MainLayout>
  );
};

export default QuotationV2;