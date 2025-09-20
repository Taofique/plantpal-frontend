import axios from "axios";
import type { TPlant, TPlantCreateInput } from "../types/plant";

// const API_URL = "http://localhost:8080/plants";
const API_URL = import.meta.env.VITE_API_URL + "/plants";

// Get all plant public

export const getPublicPlants = async (): Promise<TPlant[]> => {
  const response = await axios.get(`${API_URL}/public`);
  return response.data;
};

// Get all plants protected
export const getAllPlants = async (token: string): Promise<TPlant[]> => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get a single plant by ID
export const getPlantById = async (
  id: number,
  token: string
): Promise<TPlant> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get a single plant by ID public

export const getPlantByIdPublic = async (id: number): Promise<TPlant> => {
  const response = await axios.get(`${API_URL}/public/${id}`);
  return response.data;
};

export const getAllPlantsByUserId = async (
  token: string
): Promise<TPlant[]> => {
  try {
    const response = await axios.get<TPlant[]>(`${API_URL}/all/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user's plants", error);
    throw error;
  }
};

// Create a new plant
export const createPlant = async (
  data: TPlantCreateInput,
  token: string
): Promise<TPlant> => {
  const response = await axios.post(`${API_URL}/create`, data, {
    // FIXED: Added /create
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update a plant by ID
export const updatePlant = async (
  id: number,
  data: Partial<TPlantCreateInput>,
  token: string
): Promise<TPlant> => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a plant by ID
export const deletePlant = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
