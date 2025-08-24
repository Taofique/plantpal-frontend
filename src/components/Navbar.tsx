import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaTimes, FaList } from "react-icons/fa"; // added FaList
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (token === undefined) {
    return null;
  }

  return (
    <nav className="bg-green-700 text-white shadow-md sticky top-0 z-40 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center md:justify-between">
        {/* Brand */}
        <Link
          to={token ? "/" : "/login"}
          className="text-2xl font-bold hover:opacity-90"
        >
          PlantPal
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm">Hi, {user?.username}</span>

              <Link
                to="/"
                className="hover:bg-green-600 px-3 py-1 rounded transition"
              >
                Home
              </Link>
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

              {/* Activities button */}
              {/* <button
                onClick={() => navigate("/activities")}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition flex items-center gap-1"
              >
                <FaList /> Activities
              </button> */}

              <Link
                to="/activities"
                className="hover:bg-green-600 px-3 py-1 rounded transition"
              >
                All Activities
              </Link>

              {/* Logout pushed right */}
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="hover:bg-green-600 px-3 py-1 rounded transition"
              >
                Home
              </Link>
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

      {/* Back button */}
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

              {/* NEW: Activities mobile link */}
              <Link
                to="/activities"
                onClick={() => setOpen(false)}
                className="block bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded transition flex items-center gap-1"
              >
                <FaList /> Activities
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
