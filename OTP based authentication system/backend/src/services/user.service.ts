import { eq } from 'drizzle-orm'
import db from '../db/db'
import Users from '../db/schema/users.schema'


export const findUserByEmail = async (email :string)=>{
    try {
        if(!email){
            throw new Error("Email id ie required")
        }
        const [user]= await db.select().from(Users).where((table)=> eq(table.email, email))
        return user;
    } catch (error:any) {
        console.error("User fetching error ", error.message);
    }
}