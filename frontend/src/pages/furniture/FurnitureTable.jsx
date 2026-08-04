import Button from "../../components/ui/Button";

const FurnitureTable = ({
  furnitureList,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mt-6">

      <div className="overflow-x-auto">

        <table className="min-w-[700px] w-full">

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

              <th className="p-4 text-center text-slate-300">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {furnitureList.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="p-8 text-center text-slate-400"
                >
                  No furniture found.
                </td>

              </tr>

            ) : (

              furnitureList.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                >

                  <td className="p-4 text-white font-medium">
                    {item.name}
                  </td>

                  <td className="p-4 text-green-400 font-semibold">
                    ₹{Number(item.rate).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <Button
                        variant="secondary"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </Button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default FurnitureTable;