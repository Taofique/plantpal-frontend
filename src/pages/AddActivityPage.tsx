import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlantById } from "../api/plantService";
import type { TPlant } from "../types/plant";
import { useAuth } from "../context/AuthContext";
import { createActivity, fetchActivitiesByPlant } from "../api/activityService";
import type { TActivity, TActivityCreateInput } from "../types/activity";
import ModernMonthCalendar from "../components/ModernMonthCalendar";
import CalendarModal from "../components/CalendarModal";

export default function AddActivityPage() {
  const { plantId } = useParams<{ plantId: string }>();
  const { token, user } = useAuth();

  const [plant, setPlant] = useState<TPlant | null>(null);
  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState<TActivity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TActivityCreateInput["type"]>("water");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchPlantAndActivities = async () => {
      if (!plantId || !token) return;
      try {
        const plantData = await getPlantById(Number(plantId), token);
        setPlant(plantData);

        const actData = await fetchActivitiesByPlant(token, Number(plantId));
        setActivities(actData);
      } catch (err) {
        console.error("Failed to fetch plant/activities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlantAndActivities();
  }, [plantId, token]);

  const handleOpenModal = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
    setTitle("");
    setNotes("");
    setType("water");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantId || !token || !user?.id || !selectedDate) return;

    const newActivity: TActivityCreateInput = {
      userId: user.id,
      plantId: Number(plantId),
      title,
      type,
      notes: notes || null,
      dueAt: selectedDate.toISOString(),
    };

    try {
      const created = await createActivity(newActivity, token);
      setActivities((prev) => [...prev, created]); // update UI immediately
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create activity");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading plant details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-16 px-4 md:px-12 flex justify-center">
      <div className="bg-white/70 backdrop-blur rounded-2xl shadow-xl border border-green-100 p-6 w-full max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 text-center">
          Activities for {plant?.name || `Plant #${plantId}`} 🌱
        </h2>

        {/* Calendar */}
        <ModernMonthCalendar
          selected={selectedDate ?? undefined}
          onSelect={handleOpenModal}
          weekStartsOn={0}
          activities={activities} // ✅ pass activities to calendar
          className="mx-auto mb-6"
        />

        {/* Activity Form in Modal */}
        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <h3 className="text-xl font-semibold mb-4 text-green-700 text-center">
            Add Activity on {selectedDate?.toDateString()}
          </h3>

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
                onChange={(e) =>
                  setType(e.target.value as TActivityCreateInput["type"])
                }
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
                onClick={() => setIsModalOpen(false)}
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
        </CalendarModal>
      </div>
    </div>
  );
}
