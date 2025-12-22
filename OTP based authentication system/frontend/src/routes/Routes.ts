 import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginPage";
 
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";

 

const router = createBrowserRouter([
  { path: "/", Component: HomePage  },
  { path: "/login", Component: LoginForm },
  { path: "/register", Component: RegisterPage },
]);

export default router