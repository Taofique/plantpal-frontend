// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PlantView from "./pages/PlantView";
import CreatePlant from "./pages/CreatePlant";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
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

          {/* Redirect unmatched routes */}
          <Route path="*" element={<Login />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}
