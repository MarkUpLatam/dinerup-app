import { Navigate, Outlet, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardClient from "./pages/DashboardClient";
import DashboardCooperative from "./pages/DashboardCooperative";
import OnboardingPage from "./pages/OnboardingPage";
import ActivateAccount from "./pages/ActivateAccount";
import ForgotPassword from "./pages/password/ForgotPassword";
import ResetPassword from "./pages/password/ResetPassword";
import { useAuth } from "./context/useAuth";

function AuthLoadingScreen() {
  return <div className="min-h-screen flex items-center justify-center">Cargando sesion...</div>;
}

function getDashboardPath(role?: string | null) {
  return role?.toLowerCase() === "client"
    ? "/dashboard-client"
    : "/dashboard-cooperative";
}

function ProtectedRoute({ allowedRole }: { allowedRole?: string }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/activate" element={<ActivateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute allowedRole="client" />}>
        <Route path="/dashboard-client" element={<DashboardClient />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRole="cooperative" />}>
        <Route
          path="/dashboard-cooperative"
          element={<DashboardCooperative />}
        />
      </Route>
    </Routes>
  );
}

export default App;
