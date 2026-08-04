const TopCustomers = ({ quotations }) => {
  const customerMap = {};

  quotations.forEach((quotation) => {
    const customerName = quotation.customerName?.trim();

    if (!customerName) return;

    if (!customerMap[customerName]) {
      customerMap[customerName] = {
        name: customerName,
        quotations: 0,
        revenue: 0,
      };
    }

    customerMap[customerName].quotations += 1;
    customerMap[customerName].revenue += Number(
      quotation.grandTotal || 0
    );
  });

  const topCustomers = Object.values(customerMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🏆 Top Customers
      </h2>

      {topCustomers.length === 0 ? (

        <div className="text-center py-8 text-slate-400">
          No customer data available.
        </div>

      ) : (

        <div className="space-y-4">

          {topCustomers.map((customer, index) => (

            <div
              key={customer.name}
              className="flex justify-between items-center border-b border-slate-800 pb-4"
            >

              <div>

                <h3 className="text-white font-semibold">
                  #{index + 1} {customer.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {customer.quotations} Quotations
                </p>

              </div>

              <div className="text-right">

                <p className="text-green-400 font-bold text-lg">
                  ₹{customer.revenue.toLocaleString()}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default TopCustomers;