import axios from "axios";
import type { TRegisterInput } from "../types/auth";
import type { TUser } from "../types/user";

// const API_URL = "http://localhost:8080/users";
const API_URL = import.meta.env.VITE_API_URL + "/users";

export const registerUser = async (data: TRegisterInput) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export const getUserProfile = async (token: string) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await axios.get<TUser>(`${API_URL}/${id}`);
  return response.data;
};
