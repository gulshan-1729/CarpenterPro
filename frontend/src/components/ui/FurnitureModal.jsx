import { useEffect, useRef } from "react";

const CATEGORY_OPTIONS = [
  {
    value: "bedroom",
    label: "Bedroom",
  },
  {
    value: "living_room",
    label: "Living Room",
  },
  {
    value: "kitchen",
    label: "Kitchen",
  },
  {
    value: "office",
    label: "Office",
  },
  {
    value: "storage",
    label: "Storage",
  },
  {
    value: "other",
    label: "Other",
  },
];

const FurnitureModal = ({
  isOpen,
  onClose,
  onSave,
  furniture,
  setFurniture,
  isEditing,
  saving = false,
}) => {
  const nameInputRef =
    useRef(null);


  // ==========================================
  // AUTO FOCUS
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);


  // ==========================================
  // ESC KEY CLOSE
  // ==========================================

  useEffect(() => {
    const handleEscape = (e) => {
      if (
        e.key === "Escape" &&
        !saving
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [onClose, saving]);


  if (!isOpen) {
    return null;
  }


  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={() => {
        if (!saving) {
          onClose();
        }
      }}
    >

      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ====================================
            HEADER
        ==================================== */}

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


        {/* ====================================
            BODY
        ==================================== */}

        <div className="p-6 space-y-5">

          {/* Furniture Name */}

          <div>

            <label className="block text-slate-300 mb-2">
              Furniture Name
            </label>

            <input
              ref={nameInputRef}
              type="text"
              placeholder="e.g. Modern Wardrobe"
              value={furniture.name}
              onChange={(e) =>
                setFurniture({
                  ...furniture,
                  name: e.target.value,
                })
              }
              disabled={saving}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none px-4 py-3 text-white disabled:opacity-50"
            />

          </div>


          {/* Rate */}

          <div>

            <label className="block text-slate-300 mb-2">
              Rate Per Sq.Ft
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Rate"
                value={furniture.rate}
                onChange={(e) =>
                  setFurniture({
                    ...furniture,
                    rate: e.target.value,
                  })
                }
                disabled={saving}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none pl-9 pr-4 py-3 text-white disabled:opacity-50"
              />

            </div>

          </div>


          {/* Category */}

          <div>

            <label className="block text-slate-300 mb-2">
              Category
            </label>

            <select
              value={furniture.category}
              onChange={(e) =>
                setFurniture({
                  ...furniture,
                  category:
                    e.target.value,
                })
              }
              disabled={saving}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-400 outline-none px-4 py-3 text-white disabled:opacity-50"
            >

              <option value="">
                Select Category
              </option>

              {CATEGORY_OPTIONS.map(
                (category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="border-t border-slate-800 px-6 py-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition text-white"
          >
            Cancel
          </button>


          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition text-black font-semibold"
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Update Furniture"
                : "Save Furniture"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default FurnitureModal;