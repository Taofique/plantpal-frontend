import axios from "axios";
import type { TLoginInput } from "../types/auth";

const API_URL = "http://localhost:8080/users";

export const loginUser = async (data: TLoginInput) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
