import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/dashboard/Dashboard";
import QuotationV2 from "../pages/quotations/QuotationV2";
import Furniture from "../pages/furniture/Furniture";
import Customers from "../pages/customers/Customers";
import Reports from "../pages/reports/Reports";
import CompanySettings from "../pages/settings/CompanySettings";

import ProtectedRoute from "./ProtectedRoute";


// ==========================================
// HOME ROUTE
// ==========================================

const HomeRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // Wait until AuthContext finishes
  // checking localStorage/sessionStorage.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin mx-auto" />

          <p className="text-slate-400 mt-4">
            Loading CarpenterPro...
          </p>

        </div>
      </div>
    );
  }

  // Already logged in
  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Not logged in
  return <Login />;
};


// ==========================================
// APP ROUTES
// ==========================================

const AppRoutes = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================= */}

        <Route
          path="/"
          element={<HomeRoute />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


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
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default AppRoutes;