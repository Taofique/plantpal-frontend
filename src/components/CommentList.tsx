import type { TComment } from "../types/comment";
import { likeComment } from "../api/commentService";

type Props = {
  comments: TComment[];
  token: string;
  onLikeUpdated: (updatedComment: TComment) => void;
};

export default function CommentList({ comments, token, onLikeUpdated }: Props) {
  const handleLike = async (id: number) => {
    try {
      const updated = await likeComment(id, token);
      onLikeUpdated(updated);
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {comments.map((c) => (
        <div
          key={c.id}
          className="flex justify-between items-center border p-2 rounded"
        >
          <div>
            <span className="font-semibold mr-1">{c.username}:</span>
            <span>{c.content}</span>
          </div>
          <button
            onClick={() => handleLike(c.id)}
            className="text-red-500 font-bold"
          >
            ❤️ {c.likes}
          </button>
        </div>
      ))}
    </div>
  );
}
