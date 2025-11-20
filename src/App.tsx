import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardClient from "./pages/DashboardClient";
import DashboardCooperative from "./pages/DashboardCooperative";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard-client" element={<DashboardClient />} />
      <Route path="/dashboard-cooperative" element={<DashboardCooperative />} />
    </Routes>
  );
}

export default App;
