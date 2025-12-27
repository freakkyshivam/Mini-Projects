import { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext";
import {type User } from "@/types/types";
interface props {
    children : ReactNode;
}

export const AuthProvider = ({children}:props)=>{
    const [user, setUser] = useState<User | null>(null)

   
return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
        </UserContext.Provider>
)
        

}