import { Routes, Route, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";

export default function AuthRoutes() {
  return (
    <Routes>
      {/* Public home page */}
      <Route path="/" element={<HomePage />} />

      {/* Authentication */}
      <Route
        path="/login"
        element={
          <PageTransition>
            <AuthPage />
          </PageTransition>
        }
      />
      <Route
        path="/register"
        element={
          <PageTransition>
            <AuthPage />
          </PageTransition>
        }
      />

      {/* Redirect unknown paths to public home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
