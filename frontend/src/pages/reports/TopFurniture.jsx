const normalizeFurnitureName = (name) => {
  if (!name) return "";

  let value = String(name);

  // Remove numbering like 1.
  value = value.replace(/^\d+\./, "");

  // Remove room names
  value = value.replace(/\(.*?\)/g, "");

  value = value.trim().toLowerCase();

  if (value.includes("wardrobe")) return "Wardrobe";
  if (value.includes("tv unit")) return "TV Unit";
  if (value.includes("head board")) return "Head Board";
  if (value.includes("headboard")) return "Head Board";
  if (value.includes("bed")) return "Bed";
  if (value.includes("kitchen")) return "Kitchen";
  if (value.includes("bathroom")) return "Bathroom";
  if (value.includes("cupboard")) return "Cupboard";
  if (value.includes("door")) return "Door";
  if (value.includes("study")) return "Study Table";
  if (value.includes("shoe")) return "Shoe Rack";
  if (value.includes("dressing")) return "Dressing";
  if (value.includes("loft")) return "Loft";
  if (value.includes("piling")) return "Piling";
  if (value.includes("box")) return "Box";

  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const TopFurniture = ({ quotations = [] }) => {
  const furnitureMap = {};

  quotations.forEach((quotation) => {
    quotation.items?.forEach((item) => {
      const furnitureName = normalizeFurnitureName(
        item.furnitureName
      );

      if (!furnitureName) return;

      if (!furnitureMap[furnitureName]) {
        furnitureMap[furnitureName] = {
          name: furnitureName,
          count: 0,
          revenue: 0,
        };
      }

      furnitureMap[furnitureName].count += Number(
        item.qty || 1
      );

      furnitureMap[furnitureName].revenue += Number(
        item.total ?? item.amount ?? 0
      );
    });
  });

  const topFurniture = Object.values(furnitureMap)
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return b.revenue - a.revenue;
    })
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        🪑 Most Quoted Furniture
      </h2>

      {topFurniture.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          No furniture quoted yet.
        </div>
      ) : (
        <div className="space-y-5">

          {topFurniture.map((item, index) => (
            <div
              key={item.name}
              className="flex justify-between items-center border-b border-slate-800 pb-4"
            >
              <div>
                <h3 className="text-white font-semibold text-lg">
                  #{index + 1} {item.name}
                </h3>

                <p className="text-slate-400 text-sm">
                  Quoted {item.count} time
                  {item.count > 1 ? "s" : ""}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-400 text-2xl font-bold">
                  ₹{item.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default TopFurniture;