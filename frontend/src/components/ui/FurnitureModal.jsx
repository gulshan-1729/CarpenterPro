import { useEffect, useRef } from "react";

const FurnitureModal = ({
  isOpen,
  onClose,
  onSave,
  furniture,
  setFurniture,
  isEditing,
}) => {
  const nameInputRef = useRef(null);

  // ============================
  // Auto Focus
  // ============================

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ============================
  // ESC Key Close
  // ============================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () =>
      window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="border-b border-slate-800 px-6 py-5">

          <h2 className="text-2xl font-bold text-white">

            {isEditing
              ? "Edit Furniture"
              : "Add Furniture"}

          </h2>

          <p className="text-slate-400 mt-1 text-sm">

            {isEditing
              ? "Update furniture information."
              : "Enter furniture details below."}

          </p>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div>

            <label className="block text-slate-300 mb-2">
              Furniture Name
            </label>

            <input
              ref={nameInputRef}
              type="text"
              placeholder="Furniture Name"
              value={furniture.name}
              onChange={(e) =>
                setFurniture({
                  ...furniture,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none px-4 py-3 text-white"
            />

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Rate Per Sq.Ft
            </label>

            <input
              type="number"
              placeholder="Rate"
              value={furniture.rate}
              onChange={(e) =>
                setFurniture({
                  ...furniture,
                  rate: e.target.value,
                })
              }
              className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none px-4 py-3 text-white"
            />

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Category
            </label>

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
              className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none px-4 py-3 text-white"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="border-t border-slate-800 px-6 py-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 transition text-black font-semibold"
          >
            {isEditing ? "Update Furniture" : "Save Furniture"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default FurnitureModal;