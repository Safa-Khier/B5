import { Navigate, Outlet } from "react-router-dom";
import AuthenticatedNavBar from "./components/navigationBar/authenticatedNavBar.jsx";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? (
    <div className="flex flex-col overflow-hidden">
      <AuthenticatedNavBar />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/welcome" replace />
  );
};

export default ProtectedRoute;
