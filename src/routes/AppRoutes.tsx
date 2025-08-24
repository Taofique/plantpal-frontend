import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PlantView from "../pages/PlantView";
import PlantFullView from "../pages/PlantFullView";
import CreatePlant from "../pages/CreatePlant";
import UpdatePlant from "../pages/UpdatePlant";
import AddActivityPage from "../pages/AddActivityPage";
import ActivityFullListPage from "../pages/ActivityFullListPage";
import HomePage from "../pages/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/plants"
        element={
          <ProtectedRoute>
            <PlantView />
          </ProtectedRoute>
        }
      />

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

      {/*Activity route */}
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
    </Routes>
  );
}
