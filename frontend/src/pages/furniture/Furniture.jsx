import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import FurnitureModal from "../../components/ui/FurnitureModal";
import FurnitureToolbar from "./FurnitureToolbar";
import FurnitureTable from "./FurnitureTable";
import ConfirmModal from "../../components/ui/ConfirmModal";

const Furniture = () => {
  // ===========================
  // State
  // ===========================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [furniture, setFurniture] = useState({
    name: "",
    rate: "",
    category: "",
  });

  const [furnitureList, setFurnitureList] = useState([
    {
      name: "Wardrobe",
      rate: 900,
      category: "Storage",
    },
    {
      name: "Study Table",
      rate: 450,
      category: "Table",
    },
  ]);

  // ===========================
  // Functions
  // ===========================

  const handleSaveFurniture = () => {
    if (
      !furniture.name ||
      !furniture.rate ||
      !furniture.category
    ) {
      alert("Please fill all fields.");
      return;
    }

    setFurnitureList([
      ...furnitureList,
      {
        name: furniture.name,
        rate: furniture.rate,
        category: furniture.category,
      },
    ]);

    setFurniture({
      name: "",
      rate: "",
      category: "",
    });

    setIsModalOpen(false);
  };

 const openDeleteConfirmation = (index) => {
  setSelectedIndex(index);
  setIsConfirmOpen(true);
};
 const handleDeleteFurniture = () => {
  const updatedFurniture = furnitureList.filter(
    (_, index) => index !== selectedIndex
  );

  setFurnitureList(updatedFurniture);

  setSelectedIndex(null);
  setIsConfirmOpen(false);
};
 

  // ===========================
  // UI
  // ===========================

  return (
    <MainLayout>

      <FurnitureToolbar
        onAddFurniture={() => setIsModalOpen(true)}
      />

     <FurnitureTable
        furnitureList={furnitureList}
        onDelete={openDeleteConfirmation}
     />

      <FurnitureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFurniture}
        furniture={furniture}
        setFurniture={setFurniture}
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