import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PageLoadingSpinner from "../UI/PageLoadingSpinner";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const gateRoutes = ["/login", "/register", "/forgot-password"];

  if (loading) {
    return <PageLoadingSpinner />;
  }

  const currentPath = location.pathname;

  const justLoggedIn = sessionStorage.getItem("justLoggedIn");

  if (user && gateRoutes.includes(currentPath)) {
    if (justLoggedIn) {
      return children;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
