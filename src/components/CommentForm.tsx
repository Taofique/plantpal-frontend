// src/components/CommentForm.tsx
import { useState, useRef, useEffect } from "react";
import type { TComment } from "../types/comment";
import { addComment } from "../api/commentService";

type Props = {
  plantId: number;
  token: string;
  user: {
    id: number;
    username: string;
  } | null;
  onCommentAdded: (comment: TComment) => void;
};

export default function CommentForm({
  plantId,
  token,
  user,
  onCommentAdded,
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref to prevent multiple submits at the same time
  const submitting = useRef(false);

  // Debug: log when component mounts
  useEffect(() => {
    console.log("CommentForm mounted, user:", user);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("handleSubmit fired"); // Debug log

    if (submitting.current || !content.trim()) return;

    if (!user) {
      alert("Please login to post a comment.");
      return;
    }

    submitting.current = true;
    setLoading(true);

    try {
      const newComment = await addComment(
        {
          plantId,
          content,
          userId: user.id,
          username: user.username,
        },
        token
      );

      // Update parent state once after successful API call
      onCommentAdded(newComment);

      // Clear input field
      setContent("");
    } catch (err: any) {
      console.error("Failed to add comment:", err);
      alert(err.response?.data?.message || "Failed to add comment");
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border rounded px-3 py-1 focus:outline-none focus:ring focus:ring-green-300"
        disabled={loading || !user}
      />
      <button
        type="submit"
        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading || !user}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
