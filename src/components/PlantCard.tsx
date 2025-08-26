import type { TPlant } from "../types/plant";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deletePlant } from "../api/plantService";
import { FaCalendar, FaEdit, FaTrash, FaList } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

type PlantCardProps = {
  plant: TPlant;
  onDelete?: (id: number) => void;
  onAddActivity?: (plantId: number) => void;
  onViewActivities?: (plantId: number) => void;
};

export default function PlantCard({
  plant,
  onDelete,
  onAddActivity,
  onViewActivities,
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
      className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-green-500 group"
    >
      {/* Plant Image */}
      <div className="relative border-b-2 border-green-200">
        <img
          src={plant.imageUrl || "/placeholder-plant.png"}
          alt={plant.name}
          className="w-full h-64 object-cover"
        />

        {/* Overlay Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
          {[
            {
              onClick: () => navigate(`/plants/update/${plant.id}`),
              icon: <FaEdit className="text-green-700" />,
              title: "Edit",
            },
            {
              onClick: handleDelete,
              icon: <FaTrash className="text-red-600" />,
              title: "Delete",
            },
            {
              onClick: () => onAddActivity?.(plant.id),
              icon: <FaCalendar className="text-blue-600" />,
              title: "Add Activity",
            },
            {
              onClick: () => onViewActivities?.(plant.id),
              icon: <FaList className="text-purple-600" />,
              title: "View Activities",
            },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                btn.onClick();
              }}
              title={btn.title}
              className="bg-white bg-opacity-50 hover:bg-opacity-100 p-2 rounded-full shadow hover:shadow-lg transition transform hover:scale-110 cursor-pointer"
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Plant Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-green-800">{plant.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{plant.category}</p>
        <p className="text-gray-700 mt-2">{plant.description}</p>
        <p className="text-gray-500 mt-2 text-sm">
          Water Frequency: {plant.waterFrequency} times per week
        </p>
      </div>
    </div>
  );
}
