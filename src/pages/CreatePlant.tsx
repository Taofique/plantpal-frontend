// src/pages/CreatePlant.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlant } from "../api/plantService";
import type { TPlantCreateInput } from "../types/plant";
import { useAuth } from "../context/AuthContext";

export default function CreatePlant() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState<TPlantCreateInput>({
    name: "",
    description: "",
    category: "",
    waterFrequency: 0,
    imageUrl: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.name === "waterFrequency"
        ? Number(e.target.value)
        : e.target.value;

    const fieldName = e.target.name === "image" ? "imageUrl" : e.target.name;

    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createPlant(formData, token!); // token is required for auth
      navigate("/plants"); // go back to Plant view page
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-900">
          Add New Plant
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Plant Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            name="waterFrequency"
            placeholder="Water Frequency (days)"
            value={formData.waterFrequency}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Creating..." : "Create Plant"}
          </button>
        </form>
      </div>
    </div>
  );
}
