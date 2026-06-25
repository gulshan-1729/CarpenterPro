import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import QuotationCalculator from "../pages/quotations/QuotationCalculator";
import Furniture from "../pages/furniture/Furniture";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quotations"element={<QuotationCalculator />}/>
        <Route path="/furniture" element={<Furniture />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;