import axios from "axios";
import type { TRegisterInput } from "../types/auth";

const API_URL = "http://localhost:8080/users";

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
