import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import toast from "react-hot-toast";

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [customer, setCustomer] = useState(emptyCustomer);

  useEffect(() => {
    const savedCustomers =
      JSON.parse(
        localStorage.getItem("customers")
      ) || [];

    setCustomers(savedCustomers);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem(
      "customers",
      JSON.stringify(data)
    );
  };

  const openAddModal = () => {
    setCustomer(emptyCustomer);
    setIsEditing(false);
    setSelectedCustomerId(null);
    setShowModal(true);
  };

  const openEditModal = (customerData) => {
    setCustomer(customerData);
    setSelectedCustomerId(customerData.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = () => {
    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      toast.error(
        "Name, Phone and Address are required."
      );
      return;
    }

    if (!/^\d{10}$/.test(customer.phone)) {
      toast.success(
        "Phone number must be 10 digits."
      );
      return;
    }

    let updatedCustomers = [];

    if (isEditing) {
      updatedCustomers = customers.map(
        (item) =>
          item.id === selectedCustomerId
            ? customer
            : item
      );
    } else {
      updatedCustomers = [
        ...customers,
        {
          ...customer,
          id: Date.now(),
        },
      ];
    }

    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);

    setShowModal(false);
    setCustomer(emptyCustomer);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Delete this customer?"
    );

    if (!confirmDelete) return;

    const updatedCustomers =
      customers.filter(
        (customer) =>
          customer.id !== id
      );

    setCustomers(updatedCustomers);
    saveToStorage(updatedCustomers);
  };

  const filteredCustomers =
    customers.filter((customer) => {
      const term =
        searchTerm.toLowerCase();

      return (
        customer.name
          ?.toLowerCase()
          .includes(term) ||
        customer.phone?.includes(
          searchTerm
        ) ||
        customer.email
          ?.toLowerCase()
          .includes(term) ||
        customer.address
          ?.toLowerCase()
          .includes(term)
      );
    });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Customer Management
            </h1>

            <p className="text-slate-400 mt-2">
              Manage all your customers
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl font-semibold"
          >
            + Add Customer
          </button>

        </div>

        <div className="bg-slate-900 rounded-2xl p-4 mb-6">

          <input
            type="text"
            placeholder="Search customer..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-full bg-transparent outline-none text-white"
          />

        </div>

        <div className="bg-slate-900 rounded-2xl overflow-hidden">
             <div className="overflow-x-auto">
            

          <table className="w-full">

            <thead className="bg-slate-800">

              <tr>

                <th className="p-4 text-left text-white">
                  Name
                </th>

                <th className="p-4 text-left text-white">
                  Phone
                </th>

                <th className="p-4 text-left text-white">
                  Email
                </th>

                <th className="p-4 text-left text-white">
                  Address
                </th>

                <th className="p-4 text-center text-white">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.length >
              0 ? (
                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-700 text-white"
                    >

                      <td className="p-4">
                        {customer.name}
                      </td>

                      <td className="p-4">
                        {customer.phone}
                      </td>

                      <td className="p-4">
                        {customer.email}
                      </td>

                      <td className="p-4">
                        {customer.address}
                      </td>

                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            openEditModal(
                              customer
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg mr-2"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              customer.id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan="5"
                    className="text-center text-slate-400 p-8"
                  >
                    No customers found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

         </div>

        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg">

              <h2 className="text-2xl text-white font-bold mb-6">

                {isEditing
                  ? "Edit Customer"
                  : "Add Customer"}

              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name:
                        e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone:
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            10
                          ),
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email:
                        e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl"
                />

                <textarea
                  placeholder="Address"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address:
                        e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl"
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="bg-slate-700 px-4 py-2 rounded-lg text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-amber-500 px-4 py-2 rounded-lg text-black font-semibold"
                >
                  {isEditing
                    ? "Update"
                    : "Save"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Customers;