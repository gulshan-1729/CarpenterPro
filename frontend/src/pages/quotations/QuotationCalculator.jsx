import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

const furnitureRates = {
  Bed: 500,
  Wardrobe: 900,
  "TV Unit": 700,
  Kitchen: 1200,
};

const customers = [
  "Gulshan Sharma",
  "Amit Patil",
  "Rahul Verma",
  "Priya Shah",
];

const QuotationCalculator = () => {
  const [customer, setCustomer] = useState("");
  const [furniture, setFurniture] = useState("Bed");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [gst, setGst] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [quotations, setQuotations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const area =
    Number(length || 0) *
    Number(width || 0);

  const [rate, setRate] = useState(
  furnitureRates["Bed"]
   );

  const baseAmount = area * rate;

  const gstAmount =
    (baseAmount * Number(gst || 0)) / 100;

  const discountAmount =
    (baseAmount * Number(discount || 0)) / 100;

  const grandTotal =
    baseAmount +
    gstAmount -
    discountAmount;

  const handleSaveQuotation = () => {
  if (
    !customer ||
    !furniture ||
    !length ||
    !width
  ) {
    alert("Please fill all fields");
    return;
  }
  const newQuotation = {
   id: Date.now(),
   customer,
   furniture,
   length,
   width,
   rate,
   gst,
   discount,
   total: grandTotal,
   date: new Date().toLocaleDateString(),
   };

  setQuotations([
   ...quotations,
   newQuotation,
]);

  alert("Quotation Saved Successfully");
};

  const handleDeleteQuotation = (id) => {
  setQuotations(
    quotations.filter(
      (quotation) => quotation.id !== id
    )
  );
};
  const handleEditQuotation = (quotation) => {
  setCustomer(quotation.customer);
  setFurniture(quotation.furniture);
  setLength(quotation.length);
  setWidth(quotation.width);
  setRate(quotation.rate);
  setGst(quotation.gst);
  setDiscount(quotation.discount);

  setEditingId(quotation.id);
};

  const handleUpdateQuotation = () => {
  const updatedQuotations = quotations.map((quotation) =>
    quotation.id === editingId
      ? {
          ...quotation,
          customer,
          furniture,
          length,
          width,
          rate,
          gst,
          discount,
          total: grandTotal,
        }
      : quotation
  );

  setQuotations(updatedQuotations);

  setEditingId(null);

  alert("Quotation Updated Successfully");
};

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Smart Quotation Calculator
        </h1>

        <div className="bg-slate-900 rounded-3xl p-8">

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-slate-400 block mb-2">
                Customer
              </label>

              <select
                value={customer}
                onChange={(e) =>
                  setCustomer(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((c) => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Furniture Type
              </label>

            <select
               value={furniture}
               onChange={(e) => {
               setFurniture(e.target.value);
               setRate(furnitureRates[e.target.value]);
               }}
               className="w-full p-4 rounded-xl bg-slate-800 text-white"
            >
                <option>Bed</option>
                <option>Wardrobe</option>
                <option>TV Unit</option>
                <option>Kitchen</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Rate / Sq Ft
              </label>

             <input
              type="number"
              value={rate}
              onChange={(e) =>
              setRate(Number(e.target.value))
            }
              className="w-full p-4 rounded-xl bg-slate-800 text-white"
            />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Length (ft)
              </label>

              <input
                type="number"
                value={length}
                onChange={(e) =>
                  setLength(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Width (ft)
              </label>

              <input
                type="number"
                value={width}
                onChange={(e) =>
                  setWidth(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                GST (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={gst}
                onChange={(e) =>
                  setGst(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-2">
                Discount (%)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
                className="w-full p-4 rounded-xl bg-slate-800 text-white"
              />
            </div>

          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Area
              </h3>

              <p className="text-3xl font-bold text-white">
                {area} sq.ft
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Rate
              </h3>

              <p className="text-3xl font-bold text-amber-400">
                ₹{rate}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Base Amount
              </h3>

              <p className="text-3xl font-bold text-blue-400">
                ₹{baseAmount.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                GST Amount
              </h3>

              <p className="text-3xl font-bold text-purple-400">
                ₹{gstAmount.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-slate-400">
                Discount Amount
              </h3>

              <p className="text-3xl font-bold text-red-400">
                ₹{discountAmount.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-green-500">
              <h3 className="text-slate-400">
                Grand Total
              </h3>

              <p className="text-3xl font-bold text-green-400">
                ₹{grandTotal.toLocaleString()}
              </p>
            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-4">

         <button
            onClick={
            editingId
            ? handleUpdateQuotation
            : handleSaveQuotation
           }
           className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
           >
           {editingId
           ? "Update Quotation"
           : "Save Quotation"}
           </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Generate Invoice
            </button>

          </div>

        {quotations.length > 0 && (
  <div className="mt-10">

    <h2 className="text-2xl font-bold text-white mb-4">
      Quotation History
    </h2>

    <div className="overflow-x-auto">

      <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

     <thead>
      <tr className="bg-slate-700 text-white">
      <th className="p-4 text-left">
      Customer
     </th>

     <th className="p-4 text-left">
       Furniture
    </th>

     <th className="p-4 text-left">
      Total
     </th>

     <th className="p-4 text-left">
      Date
     </th>

     <th className="p-4 text-left">
      Action
     </th>
     </tr>
     </thead>

        <tbody>

          {quotations.map((quotation) => (

            <tr
              key={quotation.id}
              className="border-t border-slate-600 text-white"
            >

              <td className="p-4">
                {quotation.customer}
              </td>

              <td className="p-4">
                {quotation.furniture}
              </td>

              <td className="p-4 text-green-400">
                ₹{quotation.total.toLocaleString()}
              </td>

              <td className="p-4">
                {quotation.date}
              </td>

             <td className="text-center align-middle">
              <div className="flex justify-center items-center gap-3">
              <button
              onClick={() => handleEditQuotation(quotation)}
              className="w-24 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
             >
              Edit
              </button>

              <button
              onClick={() => handleDeleteQuotation(quotation.id)}
              className="w-24 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              >
               Delete
              </button>
            </div>
            </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
)}

        </div>
      </div>
    </MainLayout>
  );
};

export default QuotationCalculator;