import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getPlantById } from "../api/plantService";
import type { TPlant } from "../types/plant";
import { useAuth } from "../context/AuthContext";

export default function AddActivityPage() {
  const { plantId } = useParams<{ plantId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState("");
  const [type, setType] = useState<
    "water" | "fertilize" | "insecticide" | "weed" | "custom"
  >("water");
  const [notes, setNotes] = useState("");

  const [plant, setPlant] = useState<TPlant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      if (!plantId || !token) return;
      try {
        const data = await getPlantById(Number(plantId), token);
        setPlant(data);
      } catch (err) {
        console.error("Failed to fetch plant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [plantId, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      plantId,
      title,
      type,
      notes: notes || null,
      dueAt: date,
    });

    alert("Activity created (mock). We’ll connect to backend next!");
    navigate("/plants");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16 px-4 md:px-12 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
          Add Activity for {plant?.name || `Plant #${plantId}`} 🌱
        </h2>

        {/* Calendar */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Due Date
          </label>
          <Calendar
            onChange={(value) => setDate(value as Date)}
            value={date}
            className="rounded-lg border border-green-300"
          />
          <p className="text-gray-600 text-sm mt-2 text-center">
            Selected: {date.toDateString()}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="water">Water</option>
              <option value="fertilize">Fertilize</option>
              <option value="insecticide">Insecticide</option>
              <option value="weed">Weed</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
