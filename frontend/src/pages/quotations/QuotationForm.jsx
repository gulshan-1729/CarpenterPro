function QuotationForm({
  quotation,
  setQuotation,
}) {
  return (
    <div className="bg-white p-5 rounded shadow mb-5">

      <input
        type="text"
        placeholder="Customer Name"
        value={quotation.customer}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            customer: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="text"
        placeholder="Furniture Type"
        value={quotation.furniture}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            furniture: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Width"
        value={quotation.width}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            width: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Height"
        value={quotation.height}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            height: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Rate Per Sq Ft"
        value={quotation.rate}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            rate: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="GST %"
        value={quotation.gst}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            gst: e.target.value,
          })
        }
        className="border p-2 w-full mb-3"
      />

      <input
        type="number"
        placeholder="Discount %"
        value={quotation.discount}
        onChange={(e) =>
          setQuotation({
            ...quotation,
            discount: e.target.value,
          })
        }
        className="border p-2 w-full"
      />

    </div>
  );
}

export default QuotationForm;