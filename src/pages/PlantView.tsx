// src/pages/PlantView.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllPlants } from "../api/plantService";
import type { TPlant } from "../types/plant";
import PlantCard from "../components/PlantCard";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <p className="text-center mt-10">Loading plants...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Plant Collection
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
    </div>
  );
}
