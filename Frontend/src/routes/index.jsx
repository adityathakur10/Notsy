import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AddNotebook from "../pages/AddNotebook";
import NotebookDashboard from "../pages/NotebookDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "new-notebook",
        element: <AddNotebook />,
      },
      {
        path: "notebook/:notebookId",
        element: <NotebookDashboard />,
      },
    ],
  },
]);

export default router;
