// src/api/plantService.ts
import axios from "axios";
import type { TPlant, TPlantCreateInput } from "../types/plant";

const API_URL = "http://localhost:8080/plants";

// Get all plants (protected route)
export const getAllPlants = async (token: string): Promise<TPlant[]> => {
  const response = await axios.get(`${API_URL}/all`, {
    // FIXED: Added /all
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get a single plant by ID (protected route)
export const getPlantById = async (
  id: number,
  token: string
): Promise<TPlant> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create a new plant (protected route)
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

// Update a plant by ID (protected route)
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

// Delete a plant by ID (protected route)
export const deletePlant = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
