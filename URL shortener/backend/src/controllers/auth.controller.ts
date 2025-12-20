import argon2 from 'argon2'
import { Request,Response } from 'express'
import {signupBodySchema,loginBodySchema} from '../validation/request.validation'
import { generateToken } from '../utils/token'
import { getUserByEmail, insertUser } from '../services/user.service'
import { hashedPassword } from '../utils/hashedPassword'

export const signup = async (req:Request, res:Response)=>{
    try {
        const validationResult = await signupBodySchema.safeParseAsync(req.body)
        if(validationResult.error){
            return res.status(400).json({success:false, msg:validationResult.error.format()})
        }

        const {firstName, lastName, email, password} = validationResult.data;

        const existingUser = await getUserByEmail(email);

        if(existingUser){
            return res.status(400).json({success:false, msg:`User with this email ${email} already exits`})
        }
          const hash = await hashedPassword(password)
           const data = await insertUser(firstName,lastName,email,hash)

        return res.status(201).json({success:true, msg:"User created", userId:data.id})
    } catch (error: any ) {
        console.error(error)
    }
}

export const login = async (req:Request, res:Response)=>{
    try {
         const validationResult = await loginBodySchema.safeParseAsync(req.body)
        if(validationResult.error){
            return res.status(400).json({success:false, msg:validationResult.error.format()})
        }
        const {email, password} = validationResult.data;

            const existingUser = await getUserByEmail(email)

            if(!existingUser){
            return res.status(404).json({success:false, msg:`User with this email ${email} not found please signup`})
            }

            const isMatch = await argon2.verify(existingUser.password, password)
            if(!isMatch){
                return res.status(400).json({success:false, msg:`Password is incorrect`}) 
            }

            const token = generateToken(existingUser.id)
            
            res.cookie("token", token,{
                httpOnly: true,       
                secure: false,         
                sameSite: "strict",  
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({success:true, msg:"Login suceessful", token})
    } catch (error : any) {
        console.error(error.message)
    }
}