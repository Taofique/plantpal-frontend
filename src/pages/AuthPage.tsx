// src/pages/AuthPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faFacebookF,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authService";
import { registerUser } from "../api/userService";
import type { TLoginInput, TAuthResponse } from "../types/auth";
import type { TUserCreateInput } from "../types/user";

export default function AuthPage() {
  // Remove initialForm prop
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  // Sync with URL changes
  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-200 to-green-400 p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" />
          ) : (
            <RegisterForm key="register" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<TLoginInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response: TAuthResponse = await loginUser(formData);
      login(response.user, response.token);
      navigate("/plants");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row min-h-[550px]"
    >
      {/* Left Panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white flex-col justify-center items-center p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-4"
        >
          Welcome Back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-xs"
        >
          Enter your personal details to use all PlantPal features
        </motion.p>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full max-w-xs"
        >
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Sign In 🌱
          </h1>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mb-6">
            <SocialIcon icon={faGoogle} />
            <SocialIcon icon={faFacebookF} />
            <SocialIcon icon={faGithub} />
            <SocialIcon icon={faLinkedinIn} />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="text-right mb-4">
            <a href="#" className="text-sm text-green-700 hover:underline">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <span
              className="text-green-700 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/register")} // Use navigate instead of onToggle
            >
              Register
            </span>
          </p>
        </motion.form>
      </div>
    </motion.div>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<TUserCreateInput>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await registerUser(formData);
      login(user, token);
      navigate("/plants");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row min-h-[550px]"
    >
      {/* Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full max-w-xs"
        >
          <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Create Account 🌿
          </h1>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mb-6">
            <SocialIcon icon={faGoogle} />
            <SocialIcon icon={faFacebookF} />
            <SocialIcon icon={faGithub} />
            <SocialIcon icon={faLinkedinIn} />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <span
              className="text-green-700 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")} // Use navigate instead of onToggle
            >
              Login
            </span>
          </p>
        </motion.form>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white flex-col justify-center items-center p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-4"
        >
          Hello, Friend!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-xs"
        >
          Register with your personal details to use all PlantPal features
        </motion.p>
      </div>
    </motion.div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <a
      href="#"
      className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition"
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );
}
