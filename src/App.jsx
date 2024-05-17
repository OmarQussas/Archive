import logo from "./logo.svg";
import "./App.css";
import AuthRoute from "./components/AuthRoute/AuthRoute";

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";
import Archive from "./pages/Archive/Archive";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import Search from "./pages/Search/Search";
import { Toaster } from "react-hot-toast";
import ArchiveTable from "./components/ArchiveTable/ArchiveTable";
import { TokenProvider } from "./context/TokenContext";

// ProtectRoutes Component
const ProtectRoutes = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if token not found
    window.location.href = "/login";
    return null;
  }

  return children;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/archive",
          element: (
            <ProtectRoutes>
              <Archive />
            </ProtectRoutes>
          ),
        },
        {
          path: "/search",
          element: (
            <ProtectRoutes>
              <Search />
            </ProtectRoutes>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <TokenProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TokenProvider>
    </>
  );
}
export default App;
