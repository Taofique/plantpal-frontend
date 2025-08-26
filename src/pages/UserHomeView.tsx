import { useEffect, useState } from "react";
import { getAllPlants } from "../api/plantService";
import type { TPlant } from "../types/plant";
import {
  getCommentsByPlant,
  likeComment,
  updateComment,
  deleteComment,
} from "../api/commentService";
import type { TComment } from "../types/comment";
import CommentForm from "../components/CommentForm";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 5;

// Extend TPlant with username
type TPlantWithUsername = TPlant & { username: string };

export default function UserHomeView() {
  const [plants, setPlants] = useState<TPlantWithUsername[]>([]);
  const [visiblePlants, setVisiblePlants] = useState<TPlantWithUsername[]>([]);
  const [fadeInMap, setFadeInMap] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, TComment[]>>(
    {}
  );
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const { user, token } = useAuth();

  useEffect(() => {
    fetchPlants();
  }, [token]);

  // ---------------- Fetch Plants ---------------- //
  const fetchPlants = async () => {
    if (!token) {
      console.warn("No token, cannot fetch plants");
      return;
    }

    try {
      const dataFromAPI: TPlant[] = await getAllPlants(token);

      // Map API data to include username (required by frontend type)
      const data: TPlantWithUsername[] = dataFromAPI.map((plant) => ({
        ...plant,
        username: (plant as any).username || user?.username || "Unknown",
      }));

      setPlants(data);

      const initialPlants = data.slice(0, PAGE_SIZE);
      setVisiblePlants(initialPlants);
      initialPlants.forEach((plant) => fetchComments(plant.id));

      const fadeMap: Record<number, boolean> = {};
      initialPlants.forEach((p) => (fadeMap[p.id] = true));
      setFadeInMap(fadeMap);
    } catch (err) {
      console.error("Failed to fetch plants", err);
    }
  };

  // ---------------- Pagination ---------------- //
  const showMorePlants = () => {
    const nextPage = currentPage + 1;
    const newVisible = plants.slice(0, nextPage * PAGE_SIZE);
    setVisiblePlants(newVisible);
    setCurrentPage(nextPage);

    const newFadeMap = { ...fadeInMap };
    newVisible.forEach((p) => (newFadeMap[p.id] = true));
    setFadeInMap(newFadeMap);
  };

  // ---------------- Comments ---------------- //
  const fetchComments = async (plantId: number) => {
    if (!token) return;
    try {
      const data = await getCommentsByPlant(plantId, token);
      setCommentsMap((prev) => ({ ...prev, [plantId]: data }));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleCommentAdded = (plantId: number, newComment: TComment) => {
    setCommentsMap((prev) => ({
      ...prev,
      [plantId]: [...(prev[plantId] || []), newComment],
    }));
  };

  const handleLike = async (plantId: number, commentId: number) => {
    if (!token || !user) return;

    const alreadyLiked = commentsMap[plantId]?.find(
      (c) => c.id === commentId
    )?.likedByUser;
    if (alreadyLiked) return;

    try {
      const updated = await likeComment(commentId, token);
      setCommentsMap((prev) => ({
        ...prev,
        [plantId]: prev[plantId].map((c) =>
          c.id === commentId ? { ...updated, likedByUser: true } : c
        ),
      }));
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  const handleDelete = async (plantId: number, commentId: number) => {
    if (!token) return;

    try {
      await deleteComment(commentId, token);
      setCommentsMap((prev) => ({
        ...prev,
        [plantId]: prev[plantId].filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleUpdate = async (
    plantId: number,
    commentId: number,
    content: string
  ) => {
    if (!token) return;

    try {
      const updated = await updateComment(commentId, content, token);
      setCommentsMap((prev) => ({
        ...prev,
        [plantId]: prev[plantId].map((c) => (c.id === commentId ? updated : c)),
      }));
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const toggleComments = (plantId: number) => {
    setExpandedMap((prev) => ({ ...prev, [plantId]: !prev[plantId] }));
  };

  // ---------------- JSX ---------------- //
  return (
    <div className="bg-green-50 min-h-screen flex justify-center py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6 px-2 md:px-4">
        {visiblePlants.map((plant) => (
          <div
            key={plant.id}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-opacity duration-500 hover:scale-105`}
          >
            {/* Username */}
            <div className="px-4 pt-3 flex items-center justify-start">
              <span className="font-semibold text-sm text-green-800 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                {plant.username}
              </span>
            </div>

            {/* Plant Image */}
            <div className="w-full h-60 md:h-72 mt-2 px-4">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-full object-contain rounded-xl border border-green-200 shadow-sm"
              />
            </div>

            {/* Plant Content */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-bold text-lg text-green-800">{plant.name}</h3>
              <p className="text-sm text-gray-700 line-clamp-3">
                {plant.description}
              </p>

              {/* Comment Form */}
              <CommentForm
                plantId={plant.id}
                token={token!}
                user={user}
                onCommentAdded={(comment) =>
                  handleCommentAdded(plant.id, comment)
                }
              />

              {/* Expand / Collapse */}
              <button
                className="text-green-600 text-sm mt-2 hover:underline"
                onClick={() => toggleComments(plant.id)}
              >
                {expandedMap[plant.id] ? "Hide comments" : "View comments"}
              </button>

              {/* Comments List */}
              {expandedMap[plant.id] && (
                <ul className="mt-2 flex flex-col gap-2 max-h-56 overflow-y-auto">
                  {(commentsMap[plant.id] || []).map((c) => (
                    <li
                      key={c.id}
                      className="flex justify-between items-start border-b pb-1"
                    >
                      <div>
                        <span className="font-semibold text-sm mr-1">
                          {c.username}:
                        </span>
                        <span className="text-sm">{c.content}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {c.userId !== user?.id ? (
                          <button
                            className="text-red-500 font-bold text-sm disabled:opacity-50"
                            onClick={() => handleLike(plant.id, c.id)}
                            disabled={c.likedByUser}
                          >
                            ❤️ {c.likes}
                          </button>
                        ) : (
                          <span className="text-red-500 font-bold text-sm">
                            ❤️ {c.likes}
                          </span>
                        )}

                        {(c.userId === user?.id ||
                          plant.userId === user?.id) && (
                          <div className="flex items-center gap-1">
                            {c.userId === user?.id && (
                              <button
                                className="text-gray-500 text-sm"
                                onClick={() => {
                                  const newContent = prompt(
                                    "Update comment",
                                    c.content
                                  );
                                  if (newContent)
                                    handleUpdate(plant.id, c.id, newContent);
                                }}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="text-gray-500 text-sm"
                              onClick={() => handleDelete(plant.id, c.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* Show More Button */}
        {visiblePlants.length < plants.length && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition self-center mt-4"
            onClick={showMorePlants}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
