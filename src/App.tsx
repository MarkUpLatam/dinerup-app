import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardClient from "./pages/DashboardClient";
import DashboardCooperative from "./pages/DashboardCooperative";
import OnboardingPage from "./pages/OnboardingPage";
import ActivateAccount from "./pages/ActivateAccount";
import ForgotPassword from "./pages/password/ForgotPassword"
import ResetPassword from "./pages/password/ResetPassword";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/activate" element={<ActivateAccount />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard-client" element={<DashboardClient />} />
      <Route path="/dashboard-cooperative" element={<DashboardCooperative />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

    </Routes>
  );
}

export default App;
