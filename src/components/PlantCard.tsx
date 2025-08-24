import type { TPlant } from "../types/plant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deletePlant } from "../api/plantService";
import { FaCalendar, FaList } from "react-icons/fa"; // added FaList
import "react-calendar/dist/Calendar.css";

type PlantCardProps = {
  plant: TPlant;
  onDelete?: (id: number) => void;
  onAddActivity?: (plantId: number) => void;
  onViewActivities?: (plantId: number) => void; // NEW callback
};

export default function PlantCard({
  plant,
  onDelete,
  onAddActivity,
  onViewActivities, // NEW prop
}: PlantCardProps) {
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
      if (onDelete) onDelete(plant.id);
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to delete plant");
      alert(err.response?.data?.message || "Failed to delete plant");
    }
  };

  return (
    <div
      onClick={() => navigate(`/plants/${plant.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-green-500"
    >
      <img
        src={plant.imageUrl || "/placeholder-plant.png"}
        alt={plant.name}
        className="w-full h-48 object-cover border-2 border-green-300"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-800">{plant.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{plant.category}</p>
        <p className="text-gray-700 mt-2">{plant.description}</p>
        <p className="text-gray-500 mt-2 text-sm">
          Water Frequency: {plant.waterFrequency} times per week
        </p>

        <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/plants/update/${plant.id}`);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onAddActivity) onAddActivity(plant.id);
            }}
            className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
          >
            <FaCalendar className="mr-2" /> Add Activity
          </button>

          {/* NEW: View Activities button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onViewActivities) onViewActivities(plant.id);
            }}
            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition flex items-center"
          >
            <FaList className="mr-2" /> View Activities
          </button>
        </div>
      </div>
    </div>
  );
}
