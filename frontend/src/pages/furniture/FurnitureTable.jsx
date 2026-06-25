import Button from "../../components/ui/Button";

const FurnitureTable = ({
  furnitureList,
  onDelete,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-4 text-left text-slate-300">
              Furniture Name
            </th>

            <th className="p-4 text-left text-slate-300">
              Rate / Sq.Ft
            </th>

            <th className="p-4 text-left text-slate-300">
              Category
            </th>

            <th className="p-4 text-left text-slate-300">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {furnitureList.map((item, index) => (
            <tr
              key={index}
              className="border-t border-slate-800"
            >
              <td className="p-4 text-white">
                {item.name}
              </td>

              <td className="p-4 text-white">
                ₹{item.rate}
              </td>

              <td className="p-4 text-white">
                {item.category}
              </td>

              <td className="p-4 flex gap-3">
                <Button
                  variant="secondary"
                >
                  Edit
                </Button>

                <Button
                 variant="danger"
                 onClick={() => onDelete(index)}
                >
                 Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FurnitureTable;