export type TPlant = {
  id: number;
  name: string;
  description: string;
  category: string;
  waterFrequency: number;
  imageUrl?: string; // URL of the plant image
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number | null;
};

export type TPlantCreateInput = Omit<TPlant, "id" | "createdAt" | "updatedAt">;
