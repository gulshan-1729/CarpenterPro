const ReportCards = ({
  totalRevenue,
  totalQuotations,
  totalCustomers,
  totalFurniture,
}) => {
  const cards = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      color: "text-green-400",
    },
    {
      title: "Total Quotations",
      value: totalQuotations,
      color: "text-blue-400",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      color: "text-amber-400",
    },
    {
      title: "Furniture Items",
      value: totalFurniture,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-indigo-500 transition"
        >
          <h3 className="text-slate-400 text-sm">{card.title}</h3>

          <p className={`text-3xl font-bold mt-3 ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportCards;