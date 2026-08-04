import {
  TrendingUp,
  Trophy,
  User,
  ReceiptIndianRupee,
  Package,
  Star,
} from "lucide-react";

// Normalize Furniture Name
const normalizeFurnitureName = (name) => {
  if (!name) return "";

  let value = String(name);

  value = value.replace(/^\d+\./, "");
  value = value.replace(/\(.*?\)/g, "");
  value = value.trim().toLowerCase();

  if (value.includes("wardrobe")) return "Wardrobe";
  if (value.includes("tv unit")) return "TV Unit";
  if (value.includes("bed")) return "Bed";
  if (value.includes("kitchen")) return "Kitchen";
  if (value.includes("head board")) return "Head Board";
  if (value.includes("headboard")) return "Head Board";
  if (value.includes("cupboard")) return "Cupboard";
  if (value.includes("bathroom")) return "Bathroom";
  if (value.includes("door")) return "Door";
  if (value.includes("shoe")) return "Shoe Rack";
  if (value.includes("study")) return "Study Table";
  if (value.includes("dressing")) return "Dressing";
  if (value.includes("loft")) return "Loft";

  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

// Normalize Customer Name
const normalizeCustomer = (name) =>
  String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");

const BusinessInsights = ({ quotations = [] }) => {
  const totalRevenue = quotations.reduce(
    (sum, quotation) =>
      sum + Number(quotation.grandTotal || 0),
    0
  );

  const averageQuotation =
    quotations.length > 0
      ? totalRevenue / quotations.length
      : 0;

  const highestQuotation =
    quotations.length > 0
      ? Math.max(
          ...quotations.map((q) =>
            Number(q.grandTotal || 0)
          )
        )
      : 0;

  const customerMap = {};
  const furnitureMap = {};

  let totalItemsSold = 0;

  quotations.forEach((quotation) => {
    const customer = normalizeCustomer(
      quotation.customerName
    );

    customerMap[customer] =
      (customerMap[customer] || 0) + 1;

    quotation.items?.forEach((item) => {
      const furniture =
        normalizeFurnitureName(
          item.furnitureName
        );

      furnitureMap[furniture] =
        (furnitureMap[furniture] || 0) +
        Number(item.qty || 1);

      totalItemsSold += Number(
        item.qty || 1
      );
    });
  });

  const topCustomer =
    Object.entries(customerMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  const bestSeller =
    Object.entries(furnitureMap).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  const cards = [
    {
      title: "Average Quote",
      value: `₹${averageQuotation.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )}`,
      icon: ReceiptIndianRupee,
      color: "text-emerald-400",
    },
    {
      title: "Highest Quote",
      value: `₹${highestQuotation.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-amber-400",
    },
    {
      title: "Best Seller",
      value: bestSeller,
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      title: "Top Customer",
      value: topCustomer,
      icon: User,
      color: "text-sky-400",
    },
    {
      title: "Items Sold",
      value: totalItemsSold,
      icon: Package,
      color: "text-violet-400",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: Star,
      color: "text-pink-400",
    },
  ];

  return (
    <div className="mt-10">

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-white">
          📊 Business Insights
        </h2>

        <p className="text-slate-400">
          Quick overview of your business performance
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500 transition-all duration-300"
            >
              <div className="flex justify-between items-center">

                <div>

                  <p className="text-slate-400 text-sm">
                    {card.title}
                  </p>

                  <h3 className="text-2xl font-bold text-white mt-2 break-words">
                    {card.value}
                  </h3>

                </div>

                <div
                  className={`w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center ${card.color}`}
                >
                  <Icon size={28} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
};

export default BusinessInsights;