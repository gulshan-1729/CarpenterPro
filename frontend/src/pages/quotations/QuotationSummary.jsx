function QuotationSummary({ quotation }) {

  const area =
    Number(quotation.width || 0) *
    Number(quotation.height || 0);

  const amount =
    area *
    Number(quotation.rate || 0);

  const gstAmount =
    (amount * Number(quotation.gst || 0)) / 100;

  const discountAmount =
    (amount * Number(quotation.discount || 0)) / 100;

  const grandTotal =
    amount +
    gstAmount -
    discountAmount;

  return (
    <div className="bg-white p-5 rounded shadow">

      <h2 className="text-xl font-bold mb-4">
        Quotation Summary
      </h2>

      <p>Area: {area}</p>

      <p>Amount: ₹{amount}</p>

      <p>GST: ₹{gstAmount}</p>

      <p>Discount: ₹{discountAmount}</p>

      <p className="text-2xl font-bold mt-4">
        Grand Total: ₹{grandTotal}
      </p>

    </div>
  );
}

export default QuotationSummary;