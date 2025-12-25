 
import { AuthProvider } from "@/auth/AuthProvider";
import NavBar from "@/pages/NavBar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
const MainLayout = () => {
  return (
    <AuthProvider>
      
  <ToastContainer
/>

      <NavBar />
      <Outlet />
    </AuthProvider>
  );
};

export default MainLayout;
