// src/pages/PlantView.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllPlants } from "../api/plantService";
import type { TPlant } from "../types/plant";
import PlantCard from "../components/PlantCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PlantView() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<TPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlants = async () => {
      try {
        const data = await getAllPlants(token);
        setPlants(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch plants");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [token, navigate]);

  if (loading)
    return (
      <p className="text-center mt-10 text-green-900 font-medium">
        Loading plants...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  return (
    <div className="min-h-screen bg-green-50 pt-16 px-4 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
          Plant Collection 🌿
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onDelete={(id) =>
                setPlants((prevPlants) => prevPlants.filter((p) => p.id !== id))
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
