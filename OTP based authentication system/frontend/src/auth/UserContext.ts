import { createContext } from "react";

export interface User {
    name : string,
    email :string,
    id :string,
    isAccountVerified : boolean,
}

export interface AuthContextType {
    user : User | null,
    setUser : React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<AuthContextType | null>(null)