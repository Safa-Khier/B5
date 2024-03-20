import { Navigate, Outlet } from "react-router-dom";
import AuthenticatedNavBar from "./components/authenticatedNavBar.jsx";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <div>
      <AuthenticatedNavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/welcome" replace />
  );
};

export default ProtectedRoute;
