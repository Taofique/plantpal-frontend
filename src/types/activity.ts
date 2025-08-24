export type TActivity = {
  id: number;
  userId: number;
  plantId: number;
  title: string;
  type: "water" | "fertilize" | "insecticide" | "weed" | "custom";
  notes?: string | null;
  dueAt: string;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TActivityCreateInput = Omit<
  TActivity,
  "id" | "createdAt" | "updatedAt"
>;
