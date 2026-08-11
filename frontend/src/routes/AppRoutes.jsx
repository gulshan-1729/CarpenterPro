import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

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

        {/* =========================
            AUTHENTICATION
        ========================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =========================
            APPLICATION
        ========================= */}

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


        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;