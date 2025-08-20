// src/pages/UpdatePlant.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlantById, updatePlant } from "../api/plantService";
import type { TPlantCreateInput, TPlant } from "../types/plant";
import { useAuth } from "../context/AuthContext";

export default function UpdatePlant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState<TPlantCreateInput>({
    name: "",
    description: "",
    category: "",
    waterFrequency: 0,
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;

    const fetchPlant = async () => {
      try {
        const plant: TPlant = await getPlantById(Number(id), token);
        setFormData({
          name: plant.name,
          description: plant.description,
          category: plant.category,
          waterFrequency: plant.waterFrequency,
          imageUrl: plant.imageUrl,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch plant");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const fieldName = e.target.name === "image" ? "imageUrl" : e.target.name;
    const value =
      fieldName === "waterFrequency" ? Number(e.target.value) : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await updatePlant(Number(id), formData, token!);
      navigate("/plants");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update plant");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading plant...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-900">Update Plant</h2>
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
            disabled={saving}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            {saving ? "Updating..." : "Update Plant"}
          </button>
        </form>
      </div>
    </div>
  );
}
