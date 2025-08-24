import axios from "axios";
import type { TActivity, TActivityCreateInput } from "../types/activity";

const API_URL = "http://localhost:8080/activities";

// Create a new activity
export const createActivity = async (
  data: TActivityCreateInput,
  token: string
): Promise<TActivity> => {
  const response = await axios.post(`${API_URL}/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get all activities (full list or navbar)
export const fetchActivities = async (token: string): Promise<TActivity[]> => {
  const response = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get activities for a specific plant
export const fetchActivitiesByPlant = async (
  token: string,
  plantId: number
): Promise<TActivity[]> => {
  const response = await axios.get(`${API_URL}/plant/${plantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Mark activity as complete
export const completeActivity = async (
  id: number,
  token: string
): Promise<TActivity> => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { completedAt: new Date().toISOString() },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Delete an activity
export const deleteActivity = async (
  id: number,
  token: string
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
