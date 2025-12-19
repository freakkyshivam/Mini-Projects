import type { Request, Response } from "express";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

import db from "../db/db.js";
import Users from "../db/schema/users.schema.js";

import { signupValidation, loginValidation,otpVerificationForRegister,resetPasswordValidation } from "../validation/validation.js";
import { redis } from "../config/redis.js";
import { generateOTP, hashOTP, verifyOTP } from "../utils/otp.js";
import { findUserByEmail } from "../services/user.service.js";
import {generateAccessToken, generateRefreshToken,} from '../utils/token.js'
 
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
   const key = `otp:signup:${email}`;

  await redis.hSet(key, {
  otp: hashedOtp,
  name,
  email,
  hashedPassword,
  attempts: 0,
});

  await redis.expire(key, 300);

  return res
  .status(200)
  .json({success:true, msg:`Otp sent on email ${email}, please verify account`, otp:otp})

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
   const key = `otp:signup:${email}`; 

    const data = await redis.hGetAll(key);
    console.log(data);
    
if (!data.otp) {
  return res.status(400).json({
  success: false,
  msg: "OTP expired or not found"
});

}

  console.log(data);

    const isValid = await verifyOTP(data.otp, otp)

    if (!isValid) {
  const attempts = await redis.hIncrBy(key, "attempts", 1);
  if (attempts >= 5) {
    await redis.del(key);
  return res.status(429).json({
    success: false,
    msg: "Too many OTP attempts. Please register again."
  });
  }

  return res.status(400).json({success:false, msg:"Invaild OTP"})
}

 await redis.del(key);

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

  const accessToken = await generateAccessToken(user.id, user.email);
  const refreshToken = await generateRefreshToken(user.id, user.email);

  return res
  .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
  .status(201).json({success:true, msg:"User created successfully", user:{
    id : user.id,
    name : user.name,
    email : user.email,
    accessToken
  }})

   } catch (error :any) {
    console.error("Server error ", error.message);
     if (error.code === "23505") {
    throw new Error("Email already exists");
  }
    return res.status(500).json({msg:"Server error", error:error.message})
  }
}

export const login = async (req : Request, res:Response)=>{
  try {
    const validationResult = await loginValidation.safeParseAsync(req.body)

    if(validationResult.error){
      return res.status(400).json({seccess:false, msg:"Please enter valid details", errror:validationResult.error})
    }

    const {email, password} = validationResult.data;

    if(!email || !password){
       return res.status(400).json({seccess:false, msg:"Name , email and password are required"})
    }

    const existingUser = await findUserByEmail(email);

    if(!existingUser){
      return res.status(400).json({success:false, msg:`User with this email ${email} is not exists in database`})
    }

    const isValid = await argon2.verify(existingUser.password, password);

    if(!isValid){
      return res.status(400).json({success:false, msg:"Invalid password"});
    }

    const accessToken = await generateAccessToken(existingUser.id, existingUser.email);
  const refreshToken = await generateRefreshToken(existingUser.id, existingUser.email);

  return res
  .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
  .status(201).json({success:true, msg:"User created successfully", user:{
    id : existingUser.id,
    name : existingUser.name,
    email : existingUser.email,
    accessToken
  }})


 } catch (error :any) {
    console.error("Server error ", error.message);
    return res.status(500).json({msg:"Server error", error:error.message})
  }
}

export const resetPassword = async (req:Request, res:Response)=>{
  try {

    const validationResult = await resetPasswordValidation.safeParseAsync(req.body);

     if(validationResult.error){
      return res.status(400).json({seccess:false, msg:"Please enter valid details", errror:validationResult.error})
    }

    const {email} = validationResult.data;

    if(!email){
      return res.status(400).json({success:false, msg:"Invalid email address"})
    }

    const exitingUser = await findUserByEmail(email);

    if(!exitingUser){
      return res.status(400).json({success:false, msg:`User with this email ${email} is not exits`});
    }

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    const key = `otp:passwordReset:${email}`;

     await redis.hSet(key, {
      otp: hashedOtp,
      email,
      attempts: 0,
  });

  await redis.expire(key, 300);

return res
  .status(200)
  .json({success:true, msg:`Otp sent on email ${email}, please verify OTP`, otp:otp})
    
  } catch (error :any) {
    console.error("Server error ", error.message);
    return res.status(500).json({msg:"Server error", error:error.message})
  }
}