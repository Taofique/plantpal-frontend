import type { TUser, TUserCreateInput } from "./user";

export type TLoginInput = {
  email: string;
  password: string;
};

export type TRegisterInput = TUserCreateInput; // Reuse User creation type

export type TAuthResponse = {
  user: Omit<TUser, "password">; // Don't send password to frontend
  token: string;
};
