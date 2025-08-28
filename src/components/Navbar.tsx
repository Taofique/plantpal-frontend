import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import PlantSearchBox from "./PlantSearchBox";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleBack = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (token === undefined) return null; // Wait until auth is loaded

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-40">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        {/* Brand / Logo */}
        <Link
          to={token ? "/" : "/login"}
          className="text-2xl font-bold hover:opacity-90"
        >
          PlantPal
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <PlantSearchBox className="mr-3" />
          {token ? (
            <>
              <span className="text-sm">Hi, {user?.username}</span>
              <Link to="/" className="hover:bg-green-600 px-3 py-1 rounded">
                Home
              </Link>
              <Link
                to="/plants/logged_user"
                className="hover:bg-green-600 px-3 py-1 rounded"
              >
                Plants
              </Link>
              <Link
                to="/plants/create"
                className="hover:bg-green-600 px-3 py-1 rounded"
              >
                Add Plant
              </Link>
              <Link
                to="/activities"
                className="hover:bg-green-600 px-3 py-1 rounded"
              >
                All Activities
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 hover:bg-red-700 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:bg-green-600 px-3 py-1 rounded">
                Home
              </Link>
              <Link
                to="/login"
                className="hover:bg-green-600 px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:bg-green-600 px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger / cross button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto p-2 rounded hover:bg-green-600 transition"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Back button for desktop only */}
      {token && (
        <button
          type="button"
          onClick={handleBack}
          className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2
           bg-white text-green-700 border border-green-300 
           rounded-lg px-3 py-1 hover:bg-green-100 transition 
           items-center gap-1"
        >
          <FaArrowLeft /> <span className="hidden sm:inline">Back</span>
        </button>
      )}

      {/* Mobile menu */}
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
                to="/"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Home
              </Link>
              <Link
                to="/plants/logged_user"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Plants
              </Link>
              <Link
                to="/plants/create"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Add Plant
              </Link>
              <Link
                to="/activities"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Activities
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full text-left bg-red-500 hover:bg-red-700 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block hover:bg-green-600 px-3 py-2 rounded"
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
