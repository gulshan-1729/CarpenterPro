import { useState } from "react";
import QuotationForm from "./QuotationForm";
import QuotationSummary from "./QuotationSummary";

function Quotations() {
  const [quotation, setQuotation] = useState({
    customer: "",
    furniture: "",
    width: "",
    height: "",
    rate: "",
    gst: 18,
    discount: 0,
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Quotation Engine
      </h1>

      <QuotationForm
        quotation={quotation}
        setQuotation={setQuotation}
      />

      <QuotationSummary
        quotation={quotation}
      />
    </div>
  );
}

export default Quotations;