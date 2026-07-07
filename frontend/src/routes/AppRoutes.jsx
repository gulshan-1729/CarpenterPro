import { BrowserRouter, Routes, Route } from "react-router-dom";
import Quotations from "../pages/quotations/Quotations";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import QuotationCalculator from "../pages/quotations/QuotationCalculator";
import Furniture from "../pages/furniture/Furniture";
import Customers from "../pages/customers/Customers";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/quotations"
          element={<QuotationCalculator />}
        />

        <Route
          path="/furniture"
          element={<Furniture />}
        />

        <Route
          path="/customers"
          element={<Customers />}
        />

        <Route 
          path="/quotations"
          element={<Quotations />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;