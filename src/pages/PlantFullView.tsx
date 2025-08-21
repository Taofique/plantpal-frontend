// src/pages/PlantFullView.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPlantById } from "../api/plantService";
import type { TPlant } from "../types/plant";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PlantFullView() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [plant, setPlant] = useState<TPlant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlant = async () => {
      try {
        if (id) {
          const data = await getPlantById(Number(id), token);
          setPlant(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch plant data");
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id, token, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!plant) return <p className="text-center mt-10">Plant not found</p>;

  return (
    <div className="min-h-screen bg-green-50 p-6 md:p-12 flex justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-green-100 rounded-3xl shadow-lg overflow-hidden"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-green-800 font-semibold hover:bg-green-200 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="md:flex">
          {/* Plant Image */}
          <motion.div
            className="md:flex-1 flex justify-center items-center p-6 bg-green-200 rounded-xl m-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={plant.imageUrl || "/placeholder-plant.png"}
              alt={plant.name}
              className="rounded-2xl max-h-96 object-cover shadow-md"
            />
          </motion.div>

          {/* Plant Details */}
          <motion.div
            className="md:flex-1 p-6 flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              {plant.name}
            </h1>
            <p className="text-green-900 font-semibold mb-2">
              {plant.category}
            </p>
            <p className="text-green-800 mb-4">{plant.description}</p>

            <div className="grid grid-cols-2 gap-4 text-green-800 font-medium">
              <div>
                <span className="block text-sm text-green-700">
                  Water Frequency
                </span>
                <span>{plant.waterFrequency} times per week</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
