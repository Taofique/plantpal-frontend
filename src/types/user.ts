export type TUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  likedByUser?: boolean;
};

export type TUserCreateInput = Omit<TUser, "id" | "createdAt" | "updatedAt">;
