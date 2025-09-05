import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PageLoadingSpinner from "../UI/PageLoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoadingSpinner />;
  }

  const currentPath = location.pathname;
  const firstSegment = currentPath.split("/").filter(Boolean)[0];

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
