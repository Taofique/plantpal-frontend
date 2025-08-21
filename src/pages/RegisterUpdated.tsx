import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/userService";
import type { TUserCreateInput } from "../types/user";

export default function RegisterUpdated() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<TUserCreateInput>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-200 to-green-400">
      <div className="relative w-[768px] max-w-full min-h-[480px] bg-white rounded-3xl shadow-xl overflow-hidden flex">
        {/* Sign Up Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-xs">
            <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
              Create Account 🌿
            </h1>
            {error && <p className="text-red-500 text-center mb-3">{error}</p>}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mb-3 px-4 py-3 rounded-lg bg-green-50 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-green-700 font-semibold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>

        {/* Right Side Panel */}
        <div className="flex-1 bg-gradient-to-r from-green-600 to-green-800 text-white flex flex-col justify-center items-center p-8">
          <h1 className="text-2xl font-bold">Hello, Friend!</h1>
          <p className="mt-2 text-sm text-center max-w-xs">
            Register with your personal details to use all PlantPal features
          </p>
        </div>
      </div>
    </div>
  );
}
