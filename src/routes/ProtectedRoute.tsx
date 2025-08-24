import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();

  console.log("ProtectedRoute rendering, token:", token, "loading:", loading);
  console.log("ProtectedRoute children:", children);

  if (loading) {
    console.log("ProtectedRoute: still loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token) {
    console.log("ProtectedRoute: no token, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: token found, rendering children");
  return <>{children}</>;
}
