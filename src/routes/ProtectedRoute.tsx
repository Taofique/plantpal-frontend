// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuth();

  if (!token) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the children components
  return <>{children}</>;
}
