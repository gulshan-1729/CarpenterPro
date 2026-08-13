import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";
import QuotationV2 from "../pages/quotations/QuotationV2";
import Furniture from "../pages/furniture/Furniture";
import Customers from "../pages/customers/Customers";
import Reports from "../pages/reports/Reports";
import CompanySettings from "../pages/settings/CompanySettings";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />


        {/* =========================================
            PROTECTED ROUTES
        ========================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
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
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<CompanySettings />}
          />

        </Route>


        {/* =========================================
            FALLBACK ROUTE
        ========================================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;