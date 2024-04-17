import { Navigate, Outlet } from "react-router-dom";
import NavigationBar from "./components/navigationBar/navigationBar.jsx";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" replace />;
};

export default ProtectedRoute;
