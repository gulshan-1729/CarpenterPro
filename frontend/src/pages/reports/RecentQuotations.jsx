const formatDate = (date) => {
  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCustomer = (name) => {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

const RecentQuotations = ({ quotations = [] }) => {
  const recentQuotations = [...quotations]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-white">
            📄 Recent Quotations
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Latest 5 quotations
          </p>

        </div>

        <div className="text-slate-400 text-sm">
          Total : {recentQuotations.length}
        </div>

      </div>

      {recentQuotations.length === 0 ? (

        <div className="py-16 text-center text-slate-400">
          No quotations found.
        </div>

      ) : (

        <div className="overflow-x-auto rounded-xl">

          <table className="w-full min-w-[850px]">

            <thead className="sticky top-0 bg-slate-900">

              <tr className="border-b border-slate-800">

                <th className="text-left py-4 text-slate-300">
                  Invoice
                </th>

                <th className="text-left py-4 text-slate-300">
                  Customer
                </th>

                <th className="text-left py-4 text-slate-300">
                  Phone
                </th>

                <th className="text-left py-4 text-slate-300">
                  Date
                </th>

                <th className="text-center py-4 text-slate-300">
                  Qty
                </th>

                <th className="text-right py-4 text-slate-300">
                  Grand Total
                </th>

              </tr>

            </thead>

            <tbody>

              {recentQuotations.map((quotation) => {

                const qty =
                  quotation.items?.reduce(
                    (sum, item) =>
                      sum + Number(item.qty || 1),
                    0
                  ) || 0;

                return (

                  <tr
                    key={quotation.id}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition-all"
                  >

                    <td className="py-5 font-semibold text-amber-400">
                      {quotation.invoiceNo}
                    </td>

                    <td className="py-5 text-white">
                      {formatCustomer(
                        quotation.customerName
                      )}
                    </td>

                    <td className="py-5 text-slate-300">
                      {quotation.phone}
                    </td>

                    <td className="py-5 text-slate-300">
                      {formatDate(
                        quotation.date
                      )}
                    </td>

                    <td className="py-5 text-center text-white font-medium">
                      {qty}
                    </td>

                    <td className="py-5 text-right text-green-400 font-bold">
                      ₹
                      {Number(
                        quotation.grandTotal || 0
                      ).toLocaleString()}
                    </td>

                  </tr>

                );
              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default RecentQuotations;