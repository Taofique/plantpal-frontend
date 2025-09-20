// src/api/commentService.ts
import axios from "axios";
import type { TComment, TCommentCreateInput } from "../types/comment";

// const API_URL = "http://localhost:8080/comments";
const API_URL = import.meta.env.VITE_API_URL + "/comments";

// Get all comments for a plant
export const getCommentsByPlant = async (
  plantId: number,
  token?: string
): Promise<TComment[]> => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;

  const response = await axios.get(`${API_URL}/${plantId}`, config);
  return response.data;
};

// Add a comment (now includes username)
export const addComment = async (
  data: TCommentCreateInput,
  token: string
): Promise<TComment> => {
  const username = localStorage.getItem("username") || "Unknown"; // get logged-in username
  const payload = { ...data, username };

  const response = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a comment
export const updateComment = async (
  id: number,
  content: string,
  token: string
): Promise<TComment> => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete a comment
export const deleteComment = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Like a comment
export const likeComment = async (
  id: number,
  token: string
): Promise<TComment> => {
  const response = await axios.post(
    `${API_URL}/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
