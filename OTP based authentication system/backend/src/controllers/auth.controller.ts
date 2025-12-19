import type { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import db from "../db/db.js";
import Users from "../db/schema/users.schema.js";

import { signupValidation, loginValidation,otpVerificationForRegister } from "../validation/validation.js";
import { redis } from "../config/redis.js";
import { generateOTP, hashOTP, verifyOTP } from "../utils/otp.js";
import { findUserByEmail } from "../services/user.service.js";
 
export const register = async(req:Request, res:Response)=>{
  try {

    const validationResult = await signupValidation.safeParseAsync(req.body);
    
    if(validationResult.error){
      return res.status(400).json({seccess:false, msg:"Please enter valid details", errror:validationResult.error})
    }

    const {name, email, password} = validationResult.data;

    if(!name || !email || !password){
       return res.status(400).json({seccess:false, msg:"Name , email and password are required"})
    }

    const existingUser = await findUserByEmail(email);

    if(existingUser){
      return res.status(400).json({success:false, msg:`User with this email ${email} already registered`})
    }

    const otp = generateOTP();

    if(!otp){
      return res.status(400).json({success:false, msg:"Otp generation failed"})
    }

    console.log(otp);
    
    const hashedOtp = await hashOTP(otp);
    const hashedPassword = await argon2.hash(password)
   const key = `otp:${email}`;

  await redis.hSet(key, {
  otp: hashedOtp,
  name,
  email,
  hashedPassword,
  attempts: "0",
  createdAt: new Date().toISOString(),
});

  await redis.expire(key, 300);

  return res.status(200).json({success:true, msg:`Otp sent on email ${email}, please verify account`, otp:otp})

  } catch (error :any) {
    console.error("Server error ", error.message);
    return res.status(500).json({msg:"Server error", error:error.message})
  }
}

export const verifyOtp = async(req:Request, res:Response)=>{
  try {

    const validationResult = await otpVerificationForRegister.safeParseAsync(req.body);
    
    if(validationResult.error){
      return res.status(400).json({seccess:false, msg:"Please enter valid details", errror:validationResult.error})
    }

    const {otp, email} = validationResult.data;

     if(!otp || !email){
       return res.status(400).json({seccess:false, msg:"Name , email and password are required"})
    }
    const key = `otp:${email}`; 

    const data = await redis.hGetAll(key);

if (!data.otp) {
  throw new Error("OTP expired");
}

  console.log(data);

    const isValid = await verifyOTP(data.otp, otp)

    if (!isValid) {
  const attempts = await redis.hIncrBy(key, "attempts", 1);
  if (attempts >= 5) {
    await redis.del(key);
    throw new Error("Too many attempts");
  }

  return res.status(400).json({success:false, msg:"Invaild OTP"})
}

  const [user] = await db.insert(Users).values({
    name : data.name,
    email : data.email,
    password : data.hashedPassword,
  })
  .returning({
    id: Users.id,
    name: Users.name,
    email: Users.email,
    createdAt: Users.createdAt,
  });

  return res.status(201).json({success:true, msg:"User crraeted successfully", user:{
    id : user.id,
    name : user.name,
    email : user.email
  }})

   } catch (error :any) {
    console.error("Server error ", error.message);
     if (error.code === "23505") {
    throw new Error("Email already exists");
  }
    return res.status(500).json({msg:"Server error", error:error.message})
  }
}