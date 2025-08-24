import { Routes, Route, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";

export default function AuthRoutes() {
  return (
    <Routes>
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

      <Route path="/home" element={<HomePage />} />

      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
