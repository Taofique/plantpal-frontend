import { Routes, Route, Navigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import PlantPreviewView from "../pages/PlantPreview";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/plants/preview/:id" element={<PlantPreviewView />} />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
