import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();

  // -----------------------------------------
  // Wait while authentication is being checked
  // -----------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin" />

          <p className="text-slate-400 text-sm">
            Checking your session...
          </p>

        </div>
      </div>
    );
  }

  // -----------------------------------------
  // User is NOT logged in
  // -----------------------------------------

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // -----------------------------------------
  // User is authenticated
  // -----------------------------------------

  return <Outlet />;
};

export default ProtectedRoute;