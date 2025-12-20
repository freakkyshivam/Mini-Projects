import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/auth-request";  
import type { TokenPayload } from "../types/auth";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
 
    const cookieToken = req.cookies?.token as string | undefined; // needs cookie-parser
    const header = req.headers["authorization"];
    const headerToken = typeof header === "string" && header.startsWith("Bearer ")
      ? header.replace("Bearer ", "")
      : undefined;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized! Please login",
      });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error("authMiddleware error:", error.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};
