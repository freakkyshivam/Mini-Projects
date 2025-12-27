import { createContext } from "react";
import {type User } from "@/types/types";

export interface AuthContextType {
    user : User | null,
    setUser : React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<AuthContextType | null>(null)