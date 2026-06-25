const FurnitureModal = ({
  isOpen,
  onClose,
  onSave,
  furniture,
  setFurniture,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-800">

        <h2 className="text-2xl font-bold text-white mb-6">
          Add Furniture
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Furniture Name"
            value={furniture.name}
            onChange={(e) =>
              setFurniture({
                ...furniture,
                name: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="number"
            placeholder="Rate Per Sq Ft"
            value={furniture.rate}
            onChange={(e) =>
              setFurniture({
                ...furniture,
                rate: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
          />

          <input
            type="text"
            placeholder="Category"
            value={furniture.category}
            onChange={(e) =>
              setFurniture({
                ...furniture,
                category: e.target.value,
              })
            }
            className="w-full p-4 rounded-xl bg-slate-800 text-white"
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
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default FurnitureModal;