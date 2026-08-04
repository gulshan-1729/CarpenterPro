import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const QuotationV2 = () => {
  // ==========================================
  // CUSTOMER DETAILS
  // ==========================================

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [customers, setCustomers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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

  // ==========================================
  // ITEMS
  // ==========================================

  const createEmptyItem = () => ({
    id: Date.now() + Math.random(),
    furnitureName: "",
    length: "",
    width: "",
    rate: "",
    qty: 1,
  });

  const [items, setItems] = useState([createEmptyItem()]);

  // ==========================================
  // QUOTATIONS
  // ==========================================

  const [quotations, setQuotations] = useState(() => {
    const saved = localStorage.getItem("quotationsV2");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingId, setEditingId] = useState(null);

  const [selectedQuotation, setSelectedQuotation] =
    useState(null);

  const [showInvoiceModal, setShowInvoiceModal] =
    useState(false);

  // ==========================================
  // LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "quotationsV2",
      JSON.stringify(quotations)
    );
  }, [quotations]);

  useEffect(() => {
    const savedCustomers =
      JSON.parse(localStorage.getItem("customers")) ||
      [];

    setCustomers(savedCustomers);
  }, []);

  // ==========================================
  // ITEM FUNCTIONS
  // ==========================================

  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
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

  const handleItemChange = (
    id,
    field,
    value
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const subtotal = items.reduce((sum, item) => {
    const area =
      Number(item.length || 0) *
      Number(item.width || 0);

    const amount =
      area *
      Number(item.rate || 0) *
      Number(item.qty || 0);

    return sum + amount;
  }, 0);

  const gstAmount =
    (subtotal * Number(gst || 0)) / 100;

  const discountAmount =
    (subtotal * Number(discount || 0)) / 100;

  const grandTotal =
    subtotal + gstAmount - discountAmount;

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setCustomerName("");
    setPhone("");
    setAddress("");

    setGst(0);
    setDiscount(0);

    setEditingId(null);

    setSuggestions([]);

    setItems([createEmptyItem()]);
  };

  // ==========================================
  // SAVE QUOTATION
  // ==========================================

  const saveQuotation = () => {
    // Validation

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
        Number(item.rate) <= 0 ||
        Number(item.qty) <= 0
    );

    const currentYear = new Date().getFullYear();

    const maxInvoice = quotations.reduce((max, quotation) => {
    const parts = quotation.invoiceNo?.split("-");

    if (!parts || parts.length !== 3) return max;

 const number = parseInt(parts[2], 10);

return !isNaN(number) && number > max ? number : max;
}, 0);

const nextInvoiceNo = `CP-${currentYear}-${String(
  maxInvoice + 1
).padStart(4, "0")}`;

    if (invalidItem) {
      alert(
        "Please fill all furniture item details correctly."
      );
      return;
    }

    const processedItems = items.map((item) => {
      const area =
        Number(item.length || 0) *
        Number(item.width || 0);

      const total =
        area *
        Number(item.rate || 0) *
        Number(item.qty || 0);

      return {
        ...item,
        area,
        total,
      };
    });

    const quotation = {
      id: editingId || Date.now(),

     invoiceNo: editingId
  ? quotations.find((q) => q.id === editingId)?.invoiceNo
  : nextInvoiceNo,

      customerName,
      phone,
      address,

      items: processedItems,

      gst,
      discount,

      subtotal,
      gstAmount,
      discountAmount,
      grandTotal,

      date: new Date().toLocaleDateString(),
    };

    const customerExists = customers.find(
      (c) => c.phone === phone
    );

    if (!customerExists) {
      const updatedCustomers = [
        ...customers,
        {
          id: Date.now(),
          name: customerName,
          phone,
          address,
        },
      ];

      setCustomers(updatedCustomers);

      localStorage.setItem(
        "customers",
        JSON.stringify(updatedCustomers)
      );
    }

    let updatedQuotations;

    if (editingId) {
      updatedQuotations = quotations.map((q) =>
        q.id === editingId ? quotation : q
      );

      alert("Quotation updated successfully");
    } else {
      updatedQuotations = [
        ...quotations,
        quotation,
      ];

      alert("Quotation saved successfully");
    }

    setQuotations(updatedQuotations);

    localStorage.setItem(
      "quotationsV2",
      JSON.stringify(updatedQuotations)
    );

    resetForm();
  };

  // ==========================================
  // EDIT / DELETE
  // ==========================================

  const handleEdit = (quotation) => {
    setEditingId(quotation.id);

    setCustomerName(quotation.customerName);
    setPhone(quotation.phone);
    setAddress(quotation.address);

    setItems(quotation.items);

    setGst(quotation.gst);
    setDiscount(quotation.discount);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this quotation?")) {
      setQuotations((prev) =>
        prev.filter((q) => q.id !== id)
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
                        setCustomerName(customer.name);
                        setPhone(customer.phone);
                        setAddress(customer.address);
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

                    const area =
                      Number(item.length || 0) *
                      Number(item.width || 0);

                    const amount =
                      area *
                      Number(item.rate || 0) *
                      Number(item.qty || 0);

                    return (

                      <tr
                        key={item.id}
                        className="border-t border-slate-700 text-white"
                      >

                        <td className="p-3">

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
                            className="w-full p-2 rounded-lg bg-slate-900"
                          />

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

                        <td className="p-3 text-green-400 font-semibold">
                          {area}
                        </td>

                        <td className="p-3 text-amber-400 font-semibold">
                          ₹
                          {amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="p-3">

                          <button
                            onClick={() =>
                              removeItem(item.id)
                            }
                            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                          >
                            Delete
                          </button>

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

            <button
              onClick={saveQuotation}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold text-white"
            >
              {editingId
                ? "Update Quotation"
                : "Save Quotation"}
            </button>

            <button
              onClick={resetForm}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl text-white"
            >
              Reset
            </button>

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

                  {quotations.length === 0 ? (

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

                <h2 className="text-3xl font-bold">
                  Invoice
                </h2>

                <button
                  onClick={() =>
                    setShowInvoiceModal(false)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>

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
                      Length
                    </th>

                    <th className="border p-2">
                      Width
                    </th>

                    <th className="border p-2">
                      Rate
                    </th>

                    <th className="border p-2">
                      Qty
                    </th>

                    <th className="border p-2">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedQuotation.items.map(
                    (item) => {

                      const area =
                        Number(item.length) *
                        Number(item.width);

                      const amount =
                        area *
                        Number(item.rate) *
                        Number(item.qty);

                      return (

                        <tr key={item.id}>

                          <td className="border p-2">
                            {item.furnitureName}
                          </td>

                          <td className="border p-2">
                            {item.length}
                          </td>

                          <td className="border p-2">
                            {item.width}
                          </td>

                          <td className="border p-2">
                            {item.rate}
                          </td>

                          <td className="border p-2">
                            {item.qty}
                          </td>

                          <td className="border p-2">
                            ₹
                            {amount.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>

                        </tr>

                      );
                    }
                  )}

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

                    // Company Header
                    pdf.setFontSize(20);
                    pdf.setTextColor(44, 62, 80);

                    pdf.text(
                      "SHARMA INTERIORS & FURNITURE",
                      14,
                      20
                    );

                    pdf.setFontSize(9);

                    pdf.text(
                      "Interior Design | Modular Furniture | Custom Woodwork",
                      14,
                      27
                    );

                    pdf.setFontSize(10);

                    pdf.text(
                      "Phone: 9960040174",
                      14,
                      35
                    );

                    pdf.text(
                      "Email: ayodhyasharma06@gmail.com",
                      14,
                      41
                    );

                    // Invoice Header Box
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

                    pdf.rect(
                      14,
                      45,
                      90,
                      40
                    );

                    pdf.setFontSize(12);

                    pdf.text(
                      "Customer Details",
                      18,
                      53
                    );

                    pdf.setFontSize(10);

                    pdf.text(
                      `Name: ${selectedQuotation.customerName}`,
                      18,
                      62
                    );

                    pdf.text(
                      `Phone: ${selectedQuotation.phone}`,
                      18,
                      69
                    );

                    pdf.text(
                      `Address: ${selectedQuotation.address}`,
                      18,
                      76
                    );

                    const tableRows =
                      selectedQuotation.items.map(
                        (item) => {

                          const area =
                            Number(item.length) *
                            Number(item.width);

                          const amount =
                            area *
                            Number(item.rate) *
                            Number(item.qty);

                          return [
                            item.furnitureName,
                            area,
                            item.qty,
                            item.rate,
                            amount.toFixed(2),
                          ];
                        }
                      );
                                      autoTable(pdf, {
                      startY: 95,

                      head: [[
                        "Furniture",
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
                        fillColor: [75, 55, 120],
                        textColor: 255,
                        fontStyle: "bold",
                      },

                      alternateRowStyles: {
                        fillColor: [245, 245, 245],
                      },
                    });

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
                    // SIGNATURE
                    // ==========================================

                    const signY =
                      (pdf.lastAutoTable?.finalY ||
                        finalY) + 30;

                    pdf.line(
                      130,
                      signY,
                      190,
                      signY
                    );

                    pdf.setFontSize(10);

                    pdf.text(
                      "For Sharma Interiors & Furniture",
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

                    pdf.text(
                      "Thank You For Choosing Sharma Interiors & Furniture",
                      55,
                      270
                    );

                    pdf.text(
                      "For Queries Contact: 9960040174",
                      75,
                      277
                    );

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