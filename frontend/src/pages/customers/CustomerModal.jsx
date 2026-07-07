const CustomerModal = ({
  isOpen,
  onClose,
  onSave,
  customer,
  setCustomer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-xl border border-slate-800">

        <h2 className="text-2xl font-bold text-white mb-6">
          Customer Details
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({
                ...customer,
                name: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({
                ...customer,
                phone: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={(e) =>
              setCustomer({
                ...customer,
                email: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
          />

          <textarea
            rows="4"
            placeholder="Address"
            value={customer.address}
            onChange={(e) =>
              setCustomer({
                ...customer,
                address: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white resize-none"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-5 py-3 rounded-xl bg-amber-500 text-black font-medium"
          >
            Save Customer
          </button>

        </div>

      </div>

    </div>
  );
};

export default CustomerModal;