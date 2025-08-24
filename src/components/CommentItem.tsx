// src/components/CommentItem.tsx
import { useState } from "react";
import type { TComment } from "../types/comment";
import {
  likeComment,
  deleteComment,
  updateComment,
} from "../api/commentService";

type Props = {
  comment: TComment;
  token: string;
  onDelete: (id: number) => void;
  onUpdate: (updatedComment: TComment) => void;
};

export default function CommentItem({
  comment,
  token,
  onDelete,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [likes, setLikes] = useState(comment.likes);

  const handleLike = async () => {
    try {
      const updated = await likeComment(comment.id, token);
      setLikes(updated.likes);
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateComment(comment.id, content, token);
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id, token);
      onDelete(comment.id);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return (
    <div className="border-b py-2 flex justify-between items-start gap-2">
      <div className="flex-1">
        {editing ? (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        ) : (
          <p>{content}</p>
        )}
        <small className="text-gray-500 text-xs">Likes: {likes}</small>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleLike}
          className="px-2 py-1 text-green-600 hover:text-green-800"
        >
          ❤️
        </button>
        {editing ? (
          <button
            onClick={handleUpdate}
            className="px-2 py-1 text-blue-600 hover:text-blue-800"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-2 py-1 text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
