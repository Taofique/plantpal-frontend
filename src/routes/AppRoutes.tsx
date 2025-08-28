import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import UserHomeView from "../pages/UserHomeView";
import PlantView from "../pages/PlantView";
import PlantFullView from "../pages/PlantFullView";
import CreatePlant from "../pages/CreatePlant";
import UpdatePlant from "../pages/UpdatePlant";
import AddActivityPage from "../pages/AddActivityPage";
import ActivityFullListPage from "../pages/ActivityFullListPage";
// import ModernMonthCalendar from "../components/ModernMonthCalendar";
import PlantPreviewView from "../pages/PlantPreview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserHomeView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants/logged_user"
        element={
          <ProtectedRoute>
            <PlantView />
          </ProtectedRoute>
        }
      />

      <Route path="/plants/preview/:id" element={<PlantPreviewView />} />

      <Route
        path="/plants/create"
        element={
          <ProtectedRoute>
            <CreatePlant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants/update/:id"
        element={
          <ProtectedRoute>
            <UpdatePlant />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants/:id"
        element={
          <ProtectedRoute>
            <PlantFullView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants/:plantId/add-activity"
        element={
          <ProtectedRoute>
            <AddActivityPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activities"
        element={
          <ProtectedRoute>
            <ActivityFullListPage />
          </ProtectedRoute>
        }
      />

      {/* fallback: redirect any unknown path in protected routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
