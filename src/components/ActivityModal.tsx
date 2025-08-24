import { useEffect, useState } from "react";
import {
  fetchActivities,
  fetchActivitiesByPlant,
  completeActivity,
} from "../api/activityService";
import { getPlantById } from "../api/plantService";
import type { TActivity } from "../types/activity";
import type { TPlant } from "../types/plant";
import { useAuth } from "../context/AuthContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  plantId?: number;
};

function ActivityModal({ isOpen, onClose, plantId }: Props) {
  const { token } = useAuth();
  const [activities, setActivities] = useState<TActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [plant, setPlant] = useState<TPlant | null>(null);

  useEffect(() => {
    if (!isOpen || !token) return;

    const load = async () => {
      setLoading(true);

      try {
        if (plantId) {
          const plantData = await getPlantById(plantId, token);
          setPlant(plantData);
        }

        const data = plantId
          ? await fetchActivitiesByPlant(token, plantId)
          : await fetchActivities(token);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities or plant:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isOpen, token, plantId]);

  const handleToggle = async (id: number, checked: boolean) => {
    if (!token) return;

    setActivities((prev) =>
      prev.map((act) =>
        act.id === id
          ? { ...act, completedAt: checked ? new Date().toISOString() : null }
          : act
      )
    );

    try {
      await completeActivity(id, token);
    } catch (error) {
      console.error("Failed to update activity", error);

      setActivities((prev) =>
        prev.map((act) =>
          act.id === id
            ? { ...act, completedAt: checked ? null : act.completedAt }
            : act
        )
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {plantId
            ? `Activities for ${plant?.name || `Plant #${plantId}`}`
            : "Your Activities"}
        </h2>

        {loading ? (
          <div>Loading...</div>
        ) : activities.length === 0 ? (
          <div>No activities found.</div>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between"
              >
                <span
                  className={
                    activity.completedAt ? "line-through text-gray-400" : ""
                  }
                >
                  {activity.title}
                </span>
                <input
                  type="checkbox"
                  checked={!!activity.completedAt}
                  disabled={!!activity.completedAt}
                  onChange={(e) => handleToggle(activity.id, e.target.checked)}
                />
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ActivityModal;
