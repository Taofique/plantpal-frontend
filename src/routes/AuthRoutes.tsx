import { Routes, Route, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import AuthPage from "../pages/AuthPage";

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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
