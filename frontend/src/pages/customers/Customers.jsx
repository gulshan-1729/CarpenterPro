import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import CustomerToolbar from "./CustomerToolbar";
import CustomerTable from "./CustomerTable";
import CustomerModal from "./CustomerModal";
import ConfirmModal from "../../components/ui/ConfirmModal";

const Customers = () => {

  // ===========================
  // State
  // ===========================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [customerList, setCustomerList] = useState([
    {
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@gmail.com",
      address: "Mumbai",
    },
    {
      name: "Priya Patel",
      phone: "9988776655",
      email: "priya@gmail.com",
      address: "Pune",
    },
  ]);
  const handleSaveCustomer = () => {
  if (
    !customer.name ||
    !customer.phone ||
    !customer.email ||
    !customer.address
  ) {
    alert("Please fill all fields.");
    return;
  }

  setCustomerList([
    ...customerList,
    customer,
  ]);

  setCustomer({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  setIsModalOpen(false);
};

const openDeleteConfirmation = (index) => {
  setSelectedIndex(index);
  setIsConfirmOpen(true);
};

const handleDeleteCustomer = () => {
  const updatedCustomers = [...customerList];

  updatedCustomers.splice(selectedIndex, 1);

  setCustomerList(updatedCustomers);

  setIsConfirmOpen(false);

  setSelectedIndex(null);
};

const handleEditCustomer = (index) => {

  setCustomer(customerList[index]);

  setSelectedIndex(index);

  setIsEditing(true);

  setIsModalOpen(true);

};

const handleUpdateCustomer = () => {

  const updatedCustomers = [...customerList];

  updatedCustomers[selectedIndex] = customer;

  setCustomerList(updatedCustomers);

  setCustomer({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  setSelectedIndex(null);

  setIsEditing(false);

  setIsModalOpen(false);

};

  return (
    <MainLayout>

      <CustomerToolbar
        onAddCustomer={() => {

        setCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
         });

         setIsEditing(false);

         setIsModalOpen(true);

         }}
         searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
     />

    <CustomerTable
      customerList={customerList.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
     )}
      onEdit={handleEditCustomer}
      onDelete={openDeleteConfirmation}
    />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={
           isEditing
           ? handleUpdateCustomer
           : handleSaveCustomer
         }
        customer={customer}
        setCustomer={setCustomer}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteCustomer}
      />

    </MainLayout>
  );
};

export default Customers;