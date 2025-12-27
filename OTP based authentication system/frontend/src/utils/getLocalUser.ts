import {type User } from "@/types/types";

export const getLocalUser = (): User | null => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};
