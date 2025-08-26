import { useEffect, useState } from "react";
import { getPublicPlants } from "../api/plantService";
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

export default function UserHomeView() {
  const [plants, setPlants] = useState<TPlant[]>([]);
  const [visiblePlants, setVisiblePlants] = useState<TPlant[]>([]);
  const [fadeInMap, setFadeInMap] = useState<Record<number, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<number, TComment[]>>(
    {}
  );
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const { user, token } = useAuth();

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const data = await getPublicPlants();
      setPlants(data);
      const initialPlants = data.slice(0, PAGE_SIZE);
      setVisiblePlants(initialPlants);
      initialPlants.forEach((plant) => fetchComments(plant.id));

      // trigger fade-in for initial plants
      const fadeMap: Record<number, boolean> = {};
      initialPlants.forEach((p) => (fadeMap[p.id] = true));
      setFadeInMap(fadeMap);
    } catch (err) {
      console.error("Failed to fetch plants", err);
    }
  };

  const showMorePlants = () => {
    const nextPage = currentPage + 1;
    const newVisible = plants.slice(0, nextPage * PAGE_SIZE);
    setVisiblePlants(newVisible);
    setCurrentPage(nextPage);

    // fade-in newly added plants
    const newFadeMap = { ...fadeInMap };
    newVisible.forEach((p) => (newFadeMap[p.id] = true));
    setFadeInMap(newFadeMap);
  };

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

  return (
    <div className="bg-green-100 min-h-screen flex justify-center">
      <div className="w-full max-w-xl p-4 flex flex-col gap-6">
        {visiblePlants.map((plant) => (
          <div
            key={plant.id}
            className={`border-2 border-green-500 rounded-2xl shadow-md bg-white overflow-hidden transform transition-opacity duration-500 ${
              fadeInMap[plant.id] ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Plant Image */}
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="border border-green-500 w-full h-auto max-h-[500px] object-cover"
            />

            {/* Plant Content */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-bold text-lg">{plant.name}</h3>
              <p className="text-sm text-gray-700">{plant.description}</p>

              {/* Comment Form */}
              <CommentForm
                plantId={plant.id}
                token={token!}
                user={user}
                onCommentAdded={(comment) =>
                  handleCommentAdded(plant.id, comment)
                }
              />

              {/* Expand / Collapse button */}
              <button
                className="text-blue-500 text-sm mt-2"
                onClick={() => toggleComments(plant.id)}
              >
                {expandedMap[plant.id] ? "Hide comments" : "View comments"}
              </button>

              {/* Comments List */}
              {expandedMap[plant.id] && (
                <ul className="mt-2 flex flex-col gap-2 max-h-64 overflow-y-auto">
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
