import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import FurnitureToolbar from "./FurnitureToolbar";
import FurnitureTable from "./FurnitureTable";
import FurnitureModal from "../../components/ui/FurnitureModal";
import ConfirmModal from "../../components/ui/ConfirmModal";

// ======================================
// Default Furniture
// ======================================

const defaultFurniture = [
  {
    id: 1,
    name: "Wardrobe",
    rate: 900,
    category: "Storage",
  },
  {
    id: 2,
    name: "Study Table",
    rate: 450,
    category: "Table",
  },
];

const Furniture = () => {
  // ===========================
  // Dialog States
  // ===========================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ===========================
  // Editing State
  // ===========================

  const [editingFurniture, setEditingFurniture] = useState(null);
  const [deleteFurnitureId, setDeleteFurnitureId] = useState(null);

  // ===========================
  // Form State
  // ===========================

  const [furniture, setFurniture] = useState({
    name: "",
    rate: "",
    category: "",
  });

  // ===========================
  // Furniture List
  // ===========================

  const [furnitureList, setFurnitureList] = useState(() => {
    const saved = localStorage.getItem("furniture");

    if (saved) {
      return JSON.parse(saved);
    }

    return defaultFurniture;
  });

  // ===========================
  // Save LocalStorage
  // ===========================

  useEffect(() => {
    localStorage.setItem(
      "furniture",
      JSON.stringify(furnitureList)
    );
  }, [furnitureList]);

  // ===========================
  // Open Add Modal
  // ===========================

  const openAddModal = () => {
    setEditingFurniture(null);

    setFurniture({
      name: "",
      rate: "",
      category: "",
    });

    setIsModalOpen(true);
  };

  // ===========================
  // Open Edit Modal
  // ===========================

  const openEditModal = (item) => {
    setEditingFurniture(item);

    setFurniture({
      name: item.name,
      rate: item.rate,
      category: item.category,
    });

    setIsModalOpen(true);
  };

  // ===========================
  // Save Furniture
  // ===========================

  const handleSaveFurniture = () => {
    const name = furniture.name.trim();
    const category = furniture.category.trim();
    const rate = Number(furniture.rate);

    if (!name || !category || !rate) {
      alert("Please fill all fields.");
      return;
    }

    const duplicate = furnitureList.find(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.id !== editingFurniture?.id
    );

    if (duplicate) {
      alert("Furniture already exists.");
      return;
    }

    if (editingFurniture) {
      const updatedList = furnitureList.map((item) =>
        item.id === editingFurniture.id
          ? {
              ...item,
              name,
              rate,
              category,
            }
          : item
      );

      setFurnitureList(updatedList);
    } else {
      const newFurniture = {
        id: Date.now(),
        name,
        rate,
        category,
      };

      setFurnitureList([...furnitureList, newFurniture]);
    }

    setFurniture({
      name: "",
      rate: "",
      category: "",
    });

    setEditingFurniture(null);
    setIsModalOpen(false);
  };

  // ===========================
  // Delete
  // ===========================

  const openDeleteConfirmation = (id) => {
    setDeleteFurnitureId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteFurniture = () => {
    const updated = furnitureList.filter(
      (item) => item.id !== deleteFurnitureId
    );

    setFurnitureList(updated);

    setDeleteFurnitureId(null);
    setIsConfirmOpen(false);
  };

  // ===========================
  // UI
  // ===========================

  return (
    <MainLayout>
      <FurnitureToolbar
        onAddFurniture={openAddModal}
      />

      <FurnitureTable
        furnitureList={furnitureList}
        onEdit={openEditModal}
        onDelete={openDeleteConfirmation}
      />

      <FurnitureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFurniture(null);
        }}
        onSave={handleSaveFurniture}
        furniture={furniture}
        setFurniture={setFurniture}
        isEditing={!!editingFurniture}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Furniture"
        message="Are you sure you want to delete this furniture? This action cannot be undone."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteFurniture}
      />
    </MainLayout>
  );
};

export default Furniture;