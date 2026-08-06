import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import QuotationV2 from "../pages/quotations/QuotationV2";
import Furniture from "../pages/furniture/Furniture";
import Customers from "../pages/customers/Customers";
import Reports from "../pages/reports/Reports";
import CompanySettings from "../pages/settings/CompanySettings";

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/quotations"
          element={<QuotationV2 />}
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
          path="/settings"
          element={<CompanySettings />}
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;