import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import toast from "react-hot-toast";
import { customerAPI } from "../../services/api";

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD CUSTOMERS FROM DJANGO
  // ==========================================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await customerAPI.getAll();

      setCustomers(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load customers."
      );

      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadCustomers();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setCustomer({
      ...emptyCustomer,
    });

    setIsEditing(false);
    setSelectedCustomerId(null);
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (customerData) => {
    setCustomer({
      name: customerData.name || "",
      phone: customerData.phone || "",
      email: customerData.email || "",
      address: customerData.address || "",
    });

    setSelectedCustomerId(
      customerData.id
    );

    setIsEditing(true);
    setShowModal(true);
  };

  // ==========================================
  // SAVE / UPDATE CUSTOMER
  // ==========================================

  const handleSave = async () => {
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
      toast.error(
        "Phone number must be 10 digits."
      );

      return;
    }

    try {
      setSaving(true);

      if (isEditing) {
        // UPDATE EXISTING CUSTOMER

        const updatedCustomer =
          await customerAPI.update(
            selectedCustomerId,
            {
              name: customer.name.trim(),
              phone: customer.phone.trim(),
              email: customer.email.trim(),
              address: customer.address.trim(),
            }
          );

        setCustomers((previous) =>
          previous.map((item) =>
            item.id === selectedCustomerId
              ? updatedCustomer
              : item
          )
        );

        toast.success(
          "Customer updated successfully."
        );

      } else {
        // CREATE NEW CUSTOMER

        const newCustomer =
          await customerAPI.create({
            name: customer.name.trim(),
            phone: customer.phone.trim(),
            email: customer.email.trim(),
            address: customer.address.trim(),
          });

        setCustomers((previous) => [
          newCustomer,
          ...previous,
        ]);

        toast.success(
          "Customer added successfully."
        );
      }

      setShowModal(false);

      setCustomer({
        ...emptyCustomer,
      });

      setSelectedCustomerId(null);

      setIsEditing(false);

    } catch (error) {
      console.error(
        "Customer save failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to save customer."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this customer?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await customerAPI.delete(id);

      setCustomers((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

      toast.success(
        "Customer deleted successfully."
      );

    } catch (error) {
      console.error(
        "Customer deletion failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to delete customer."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

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

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

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
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl font-semibold transition"
          >
            + Add Customer
          </button>

        </div>


        {/* =====================================
            SEARCH
        ===================================== */}

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


        {/* =====================================
            LOADING
        ===================================== */}

        {loading ? (
          <div className="bg-slate-900 rounded-2xl p-12 text-center">

            <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-amber-500 rounded-full animate-spin" />

            <p className="text-slate-400 mt-4">
              Loading customers...
            </p>

          </div>
        ) : (

          /* ===================================
             CUSTOMER TABLE
          =================================== */

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

                  {filteredCustomers.length > 0 ? (

                    filteredCustomers.map(
                      (customer) => (

                        <tr
                          key={customer.id}
                          className="border-t border-slate-700 text-white hover:bg-slate-800 transition"
                        >

                          <td className="p-4">
                            {customer.name}
                          </td>

                          <td className="p-4">
                            {customer.phone}
                          </td>

                          <td className="p-4">
                            {customer.email || "-"}
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
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg mr-2 transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  customer.id
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition"
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
                        {searchTerm
                          ? "No customers match your search."
                          : "No customers found."}
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* =====================================
            ADD / EDIT MODAL
        ===================================== */}

        {showModal && (

          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">

            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg">

              <h2 className="text-2xl text-white font-bold mb-6">

                {isEditing
                  ? "Edit Customer"
                  : "Add Customer"}

              </h2>


              <div className="space-y-4">

                {/* Name */}

                <input
                  type="text"
                  placeholder="Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />


                {/* Phone */}

                <input
                  type="text"
                  placeholder="Phone"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />


                {/* Email */}

                <input
                  type="email"
                  placeholder="Email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      email: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                />


                {/* Address */}

                <textarea
                  placeholder="Address"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />

              </div>


              {/* =================================
                  MODAL ACTIONS
              ================================= */}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => {
                    setShowModal(false);
                    setCustomer({
                      ...emptyCustomer,
                    });
                  }}
                  disabled={saving}
                  className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-black font-semibold transition"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
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