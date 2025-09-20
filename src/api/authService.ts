import axios from "axios";
import type { TLoginInput } from "../types/auth";

// const API_URL = "http://localhost:8080/users";
const API_URL = import.meta.env.VITE_API_URL + "/users";

export const loginUser = async (data: TLoginInput) => {
  const response = await axios.post(`${API_URL}/login`, data);
  const { token } = response.data;
  return token; // Context will handle storage
};

export const fetchUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // { id, username, email }
};

export const logoutUser = async (token: string) => {
  // If your backend supports logout endpoint:
  await axios.post(
    `${API_URL}/logout`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
