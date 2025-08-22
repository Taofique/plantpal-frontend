// src/components/Navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Don't show navbar while checking auth status
  if (token === undefined) {
    return null;
  }

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center md:justify-between">
        {/* Brand */}
        <Link
          to={token ? "/plants" : "/login"}
          className="text-2xl font-bold hover:opacity-90"
        >
          PlantPal
        </Link>

        {/* Desktop nav (right side) */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded hover:bg-green-600 transition absolute right-4 top-1/2 -translate-y-1/2"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Back button pinned to far-left */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-1/2 left-4 -translate-y-1/2
                   bg-white text-green-700 border border-green-300 
                   rounded-lg px-3 py-1 hover:bg-green-100 transition 
                   flex items-center gap-1"
      >
        <FaArrowLeft /> <span className="hidden sm:inline">Back</span>
      </button>

      {/* Mobile menu dropdown */}
      <div
        id="mobile-menu"
        className={`${
          open ? "block" : "hidden"
        } md:hidden border-t border-green-600`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
          {token ? (
            <>
              <div className="text-sm opacity-90">Hi, {user?.username}</div>
              <Link
                to="/plants"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded transition"
              >
                Plants
              </Link>
              <Link
                to="/plants/create"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded transition"
              >
                Add Plant
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
