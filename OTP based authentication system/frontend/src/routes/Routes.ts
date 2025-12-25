import HomePage from "@/pages/HomePage";
import LoginForm from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import MainLayout from "@/layout/MainComponent";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "login", Component: LoginForm },
      { path: "register", Component: RegisterPage },
      { path: "dashboard", Component: UserDashboard },
    ],
  },
]);

export default router;
