export type UserProfile = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
};

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<"username", string[]>>;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
  message: null,
};

export const initialProfileActionState: ProfileActionState = {
  status: "idle",
  message: null,
};
