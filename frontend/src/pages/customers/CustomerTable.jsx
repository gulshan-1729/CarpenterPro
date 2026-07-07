import { Pencil, Trash2 } from "lucide-react";

const CustomerTable = ({
  customerList,
  onEdit,
  onDelete,
}) => {
  if (customerList.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl p-12 text-center">
        <h2 className="text-xl text-slate-300 font-semibold">
          No Customers Found
        </h2>

        <p className="text-slate-500 mt-2">
          Click "Add Customer" to create your first customer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr>
            <th className="text-left p-4 text-slate-300">
              Customer Name
            </th>

            <th className="text-left p-4 text-slate-300">
              Phone
            </th>

            <th className="text-left p-4 text-slate-300">
              Email
            </th>

            <th className="text-left p-4 text-slate-300">
              Address
            </th>

            <th className="text-center p-4 text-slate-300">
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {customerList.map((customer, index) => (

            <tr
              key={index}
              className="border-t border-slate-800 hover:bg-slate-800 transition"
            >

              <td className="p-4 text-white">
                {customer.name}
              </td>

              <td className="p-4 text-white">
                {customer.phone}
              </td>

              <td className="p-4 text-white">
                {customer.email}
              </td>

              <td className="p-4 text-white">
                {customer.address}
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => onEdit(index)}
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default CustomerTable;