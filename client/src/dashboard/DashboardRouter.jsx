import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Profile from "../pages/Profile";
import Rooms from "../pages/Rooms";
import FoodMenu from "../pages/FoodMenu";
import Layout from "../components/Layout";

function DashboardRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!storedUser || !token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return null; // Will redirect in useEffect
  }

  const user = JSON.parse(storedUser);

  return (
    <Layout>
      <Routes>
        {/* Main Dashboard */}
        <Route 
          path="/" 
          element={user.role === "admin" ? <AdminDashboard user={user} /> : <UserDashboard user={user} />} 
        />
        
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Rooms Route */}
        <Route path="/rooms" element={<Rooms />} />
        
        {/* Food Menu Route */}
        <Route path="/food-menu" element={<FoodMenu />} />
        
        {/* Default to dashboard */}
        <Route 
          path="*" 
          element={user.role === "admin" ? <AdminDashboard user={user} /> : <UserDashboard user={user} />} 
        />
      </Routes>
    </Layout>
  );
}

export default DashboardRouter;