import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function PublicRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/users" />;
}

export default PublicRoute;
