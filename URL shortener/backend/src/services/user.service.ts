import db from '../db/db'
import { userTable } from '../models/user.model'
import { eq } from 'drizzle-orm'

export const getUserByEmail = async (email:string)=>{
     const [existingUser] = await db.select({
        id: userTable.id,
        firstName : userTable.firstName,
        lastName : userTable.lastName,
        email : userTable.email,
        password : userTable.password
     })
            .from(userTable)
            .where((table)=> eq(table.email, email))

            return existingUser
}

export const getUserById = async (id:string)=>{
     const [existingUser] = await db.select({
        id: userTable.id,
        firstName : userTable.firstName,
        lastName : userTable.lastName,
        email : userTable.email
     })
            .from(userTable)
            .where((table)=> eq(table.id, id))

            return existingUser
}

 
export const insertUser = async (firstName:string, lastName:string | undefined, email:string, password:string)=>{
     const [data] = await db.insert(userTable).values({
            firstName ,
            lastName ,
            email,
            password
        }).returning({id:userTable.id})

        return data;
}