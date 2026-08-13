import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import FurnitureToolbar from "./FurnitureToolbar";
import FurnitureTable from "./FurnitureTable";
import FurnitureModal from "../../components/ui/FurnitureModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import toast from "react-hot-toast";
import { furnitureAPI } from "../../services/api";

const emptyFurniture = {
  name: "",
  rate: "",
  category: "",
};

const Furniture = () => {
  // ==========================================
  // DIALOG STATES
  // ==========================================

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isConfirmOpen, setIsConfirmOpen] =
    useState(false);


  // ==========================================
  // EDIT / DELETE STATES
  // ==========================================

  const [editingFurniture, setEditingFurniture] =
    useState(null);

  const [deleteFurnitureId, setDeleteFurnitureId] =
    useState(null);


  // ==========================================
  // FORM STATE
  // ==========================================

  const [furniture, setFurniture] =
    useState(emptyFurniture);


  // ==========================================
  // FURNITURE LIST
  // ==========================================

  const [furnitureList, setFurnitureList] =
    useState([]);


  // ==========================================
  // LOADING STATES
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);


  // ==========================================
  // LOAD FURNITURE FROM DJANGO
  // ==========================================

  const loadFurniture = async () => {
    try {
      setLoading(true);

      const data =
        await furnitureAPI.getAll();

      setFurnitureList(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load furniture:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load furniture."
      );

      setFurnitureList([]);

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    loadFurniture();
  }, []);


  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const openAddModal = () => {
    setEditingFurniture(null);

    setFurniture({
      ...emptyFurniture,
    });

    setIsModalOpen(true);
  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (item) => {
    setEditingFurniture(item);

    setFurniture({
      name: item.name || "",
      rate: item.rate || "",
      category: item.category || "",
    });

    setIsModalOpen(true);
  };


  // ==========================================
  // SAVE / UPDATE FURNITURE
  // ==========================================

  const handleSaveFurniture = async () => {
    const name =
      furniture.name.trim();

    const category =
      furniture.category.trim();

    const rate =
      Number(furniture.rate);


    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !name ||
      !category ||
      !rate ||
      rate <= 0
    ) {
      toast.error(
        "Please fill all fields correctly."
      );

      return;
    }


    // ------------------------------------------
    // DUPLICATE CHECK
    // ------------------------------------------

    const duplicate =
      furnitureList.find(
        (item) =>
          item.name
            ?.toLowerCase()
            .trim() ===
            name.toLowerCase() &&
          item.id !==
            editingFurniture?.id
      );

    if (duplicate) {
      toast.error(
        "Furniture already exists."
      );

      return;
    }


    try {
      setSaving(true);


      // ========================================
      // UPDATE
      // ========================================

      if (editingFurniture) {

        const updatedFurniture =
          await furnitureAPI.update(
            editingFurniture.id,
            {
              name,
              category,
              rate: rate.toFixed(2),
              unit: "sqft",
            }
          );


        setFurnitureList(
          (previous) =>
            previous.map((item) =>
              item.id ===
              editingFurniture.id
                ? updatedFurniture
                : item
            )
        );


        toast.success(
          "Furniture updated successfully."
        );

      } else {

        // ======================================
        // CREATE
        // ======================================

        const newFurniture =
          await furnitureAPI.create({
            name,
            category,
            rate: rate.toFixed(2),
            unit: "sqft",
          });


        setFurnitureList(
          (previous) => [
            newFurniture,
            ...previous,
          ]
        );


        toast.success(
          "Furniture added successfully."
        );
      }


      // ------------------------------------------
      // RESET FORM
      // ------------------------------------------

      setFurniture({
        ...emptyFurniture,
      });

      setEditingFurniture(null);

      setIsModalOpen(false);

    } catch (error) {
      console.error(
        "Furniture save failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to save furniture."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // OPEN DELETE CONFIRMATION
  // ==========================================

  const openDeleteConfirmation = (id) => {
    setDeleteFurnitureId(id);
    setIsConfirmOpen(true);
  };


  // ==========================================
  // DELETE FURNITURE
  // ==========================================

  const handleDeleteFurniture = async () => {
    if (!deleteFurnitureId) {
      return;
    }

    try {
      setDeleting(true);

      await furnitureAPI.delete(
        deleteFurnitureId
      );


      setFurnitureList(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !==
              deleteFurnitureId
          )
      );


      toast.success(
        "Furniture deleted successfully."
      );


      setDeleteFurnitureId(null);
      setIsConfirmOpen(false);

    } catch (error) {
      console.error(
        "Furniture deletion failed:",
        error
      );

      toast.error(
        error.message ||
          "Unable to delete furniture."
      );

    } finally {
      setDeleting(false);
    }
  };


  // ==========================================
  // UI
  // ==========================================

  return (
    <MainLayout>

      <FurnitureToolbar
        onAddFurniture={openAddModal}
      />


      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="bg-slate-900 rounded-2xl border border-slate-800 mt-6 p-12 text-center">

          <div className="inline-block w-8 h-8 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />

          <p className="text-slate-400 mt-4">
            Loading furniture...
          </p>

        </div>

      ) : (

        <FurnitureTable
          furnitureList={furnitureList}
          onEdit={openEditModal}
          onDelete={openDeleteConfirmation}
        />

      )}


      {/* ======================================
          FURNITURE MODAL
      ====================================== */}

      <FurnitureModal
        isOpen={isModalOpen}

        onClose={() => {
          if (saving) return;

          setIsModalOpen(false);
          setEditingFurniture(null);

          setFurniture({
            ...emptyFurniture,
          });
        }}

        onSave={handleSaveFurniture}

        furniture={furniture}

        setFurniture={setFurniture}

        isEditing={!!editingFurniture}

        saving={saving}
      />


      {/* ======================================
          DELETE CONFIRMATION
      ====================================== */}

      <ConfirmModal
        isOpen={isConfirmOpen}

        title="Delete Furniture"

        message={
          "Are you sure you want to delete this furniture? This action cannot be undone."
        }

        onCancel={() => {
          if (deleting) return;

          setIsConfirmOpen(false);
          setDeleteFurnitureId(null);
        }}

        onConfirm={
          handleDeleteFurniture
        }
      />

    </MainLayout>
  );
};

export default Furniture;