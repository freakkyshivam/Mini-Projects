import type { Request, Response } from "express";
import { and, desc, eq,ne } from "drizzle-orm";

import db from "../db/db.js";
import Users from "../db/schema/users.schema.js";
import { UserSessions } from "../db/schema/user_sessions.schema.js";

import argon2 from 'argon2'
import { changePasswordValiadtion,updateNameValidation } from "../validation/validation.js";

export const UserInfo = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { sid } = req.cookies;

    if (!sid) {
      return res
        .status(400)
        .json({ success: false, msg: "Session id not found" });
    }

    const result = await db
      .select({
        user: Users,
        session: UserSessions,
      })
      .from(Users)
      .innerJoin(
        UserSessions,
        and(
          eq(UserSessions.userId, Users.id),
          eq(UserSessions.id, sid),
          eq(UserSessions.isActive, true)
        )
      )
      .where(eq(Users.id, user.id));

    if (!result.length) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired session" });
    }

    return res.status(200).json({
      success: true,
      user: result[0].user,
      session: result[0].session,
    });
  } catch (error: any) {
    console.error("User info fetching error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};


export const allSessions = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const {sid} = req.cookies;

    const sessions = await db
      .select()
      .from(UserSessions)
      .orderBy(desc(UserSessions.createdAt))
      .where(
        and(
           eq(UserSessions.userId, user.id),
           ne(UserSessions.id, sid)
        )
       );

    return res.status(200).json({
      success: true,
     data: sessions,
    });
  } catch (error: any) {
    console.error("User session fetching error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const validationResult = await changePasswordValiadtion.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please enter valid details",
          error: validationResult.error,
        });
    }

    const { password, newPassword } = validationResult.data;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, msg: "Password are required" });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const [updatedUser] = await db
      .update(Users)
      .set({ password: hashedPassword })
      .where(eq(Users.email, user?.email))
      .returning();

    return res
      .status(200)
      .json({ success: true, msg: "Password upadated successfully" });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const updateName = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const validationResult = await updateNameValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please enter valid details",
          error: validationResult.error,
        });
    }

    const { name} = validationResult.data;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, msg: "Password are required" });
    }

      await db
      .update(Users)
      .set({ name : name })
      .where(eq(Users.email, user?.email))
      

    return res
      .status(200)
      .json({ success: true, msg: "Name upadated successfully" });
  } catch (error: any) {
    console.error("Update name error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};