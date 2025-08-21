import type { TPlant } from "../types/plant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deletePlant } from "../api/plantService";

type PlantCardProps = {
  plant: TPlant;
  onDelete?: (id: number) => void; // optional callback to update parent
};

export default function PlantCard({ plant, onDelete }: PlantCardProps) {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!token) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this plant?"
    );
    if (!confirm) return;

    try {
      await deletePlant(plant.id, token);
      if (onDelete) onDelete(plant.id); // notify parent to remove from state
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to delete plant");
      alert(err.response?.data?.message || "Failed to delete plant");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={plant.imageUrl || "/placeholder-plant.png"}
        alt={plant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-800">{plant.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{plant.category}</p>
        <p className="text-gray-700 mt-2">{plant.description}</p>
        <p className="text-gray-500 mt-2 text-sm">
          Water Frequency: {plant.waterFrequency} times per week
        </p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => navigate(`/plants/update/${plant.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
