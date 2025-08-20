// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          PlantPal
        </Link>

        {token ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hi, {user?.username}</span>
            <Link
              to="/plants"
              className="hover:bg-green-600 px-3 py-1 rounded transition"
            >
              Plants
            </Link>
            <Link
              to="/plants/create"
              className="hover:bg-green-600 px-3 py-1 rounded transition"
            >
              Add Plant
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="hover:bg-green-600 px-3 py-1 rounded transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:bg-green-600 px-3 py-1 rounded transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
