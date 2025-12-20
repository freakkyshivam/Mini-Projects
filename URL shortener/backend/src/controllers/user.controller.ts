import db from '../db/db'
import { userTable } from '../models/user.model'
import { Response } from 'express'
import { AuthRequest } from '../types/auth-request'
import { eq } from 'drizzle-orm'

export const userInfo = async (req:AuthRequest, res:Response)=>{
    try {
        const user = req.user;

        if(!user){
            return res.status(401).json({success:false, msg:"Invalid credential"})
        }

        const [data] = await db.select({
            id:userTable.id,
            firstName : userTable.firstName,
            lastName : userTable.lastName,
            email : userTable.email
        }).from(userTable).where((table)=> eq(table.id, user.id))

        res.json(data)
    } catch (error:any) {
        console.error(error.message)
    }
}