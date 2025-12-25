import type { Request, Response } from "express";
import argon2 from "argon2";
import { and, eq, ne } from "drizzle-orm";

import db from "../db/db.js";
import Users from "../db/schema/users.schema.js";
import { UserSessions } from "../db/schema/user_sessions.schema.js";

import {
  signupValidation,
  loginValidation,
  otpVerificationForRegister,
  sendResetOtpValidation,
  resetPasswordValidation,
  changePasswordValiadtion,
} from "../validation/validation.js";

import { redis } from "../config/redis.js";

import { findUserByEmail } from "../services/user.service.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

import {
  sendRegisterAccountVerifyEmail,
  sendPasswordRestEmail,
  sendPasswordRestAlertEmail,
} from "../services/mail/mail.service.js";
import { sendOtp, verifyOtp } from "../services/otp/otp.service.js";

import crypto from "node:crypto";
 

export const register = async (req: Request, res: Response) => {
  try {
    const validationResult = await signupValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Please enter valid details",
          errror: validationResult.error,
        });
    }

    const { name, email, password } = validationResult.data;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Name , email and password are required",
        });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          msg: `User with this email ${email} already registered`,
        });
    }

    const otp = await sendOtp({
      identifier: email,
      purpose: "ACCOUNT_VERIFY",
    });

    const hashedPassword = await argon2.hash(password);

    await redis.set(
      `pending-user:${email}`,
      JSON.stringify({ name, email, hashedPassword }),
      { EX: 600 }
    );

    await sendRegisterAccountVerifyEmail(name, email, otp);

    return res.status(200).json({
      success: true,
      msg: "OTP sent. Please verify to complete registration.",
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const verifyRegisterOtp = async (req: Request, res: Response) => {
  try {
    const validationResult = otpVerificationForRegister.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ success: false });
    }

    const { email, otp } = validationResult.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already verified",
      });
    }

    const pending = await redis.get(`pending-user:${email}`);
    if (!pending) {
      return res.status(400).json({ msg: "Registration expired" });
    }

    const { name, hashedPassword } = JSON.parse(pending);

    const result = await verifyOtp({
      identifier: email,
      purpose: "ACCOUNT_VERIFY",
      otp,
    });

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        msg: result.reason,
      });
    }

    await redis.del(`pending-user:${email}`);

    const [user] = await db
      .insert(Users)
      .values({
        name,
        email,
        password: hashedPassword,
        isAccountVerified: true,
        lastLoginAt: new Date(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      msg: "Registration successfull",
    });
  } catch (err: any) {
    return res.status(500).json({ success: false });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validationResult = await loginValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Please enter valid details",
          errror: validationResult.error,
        });
    }

    const { email, password } = validationResult.data;

    if (!email || !password) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Name , email and password are required",
        });
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          msg: `User with this email ${email} is not exists in database`,
        });
    }

    const isValid = await argon2.verify(existingUser.password, password);

    if (!isValid) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    if (existingUser.is2fa) {
    }

    const accessToken = await generateAccessToken(
      existingUser.id,
      existingUser.email
    );
    const refreshToken = await generateRefreshToken(
      existingUser.id,
      existingUser.email
    );

    await db
      .update(Users)
      .set({
        lastLoginAt: new Date(),
      })
      .where(eq(Users.email, email));

    const hashedRefreshToken = await argon2.hash(refreshToken as string);
    const sessionId = crypto.randomUUID();
    const device = req.deviceInfo;

    console.log(device);

    await db.insert(UserSessions).values({
      id: sessionId,
      userId: existingUser.id,
      refreshToken: hashedRefreshToken,
      isActive: true,

      deviceName: req.deviceInfo?.deviceName ?? null,
      deviceType: req.deviceInfo?.deviceType ?? null,
      os: req.deviceInfo?.os ?? null,
      browser: req.deviceInfo?.browser ?? null,
      ipAddress: req.deviceInfo?.ipAddress ?? null,
    });

    // const options = {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV === "production",
    //       sameSite: "strict",
    // }

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      .cookie("sid", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        msg: "User login successfully",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          isAccountVerified : existingUser.isAccountVerified
        },
         accessToken,
          device,
      });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const sendResetOtp = async (req: Request, res: Response) => {
  try {
    const validationResult = await sendResetOtpValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Please enter valid details",
          errror: validationResult.error,
        });
    }

    const { email } = validationResult.data;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid email address" });
    }

    const exitingUser = await findUserByEmail(email);

    if (!exitingUser) {
      return res
        .status(400)
        .json({
          success: false,
          msg: `User with this email ${email} is not exits`,
        });
    }

    const otp = await sendOtp({
      identifier: email,
      purpose: "RESET_PASSWORD",
    });

    await sendPasswordRestEmail(exitingUser.name, email, otp);

    return res
      .status(200)
      .json({
        success: true,
        msg: `Otp sent on email ${email}, please verify OTP`,
      });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const validationResult = await resetPasswordValidation.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res
        .status(400)
        .json({
          seccess: false,
          msg: "Please enter valid details",
          errror: validationResult.error,
        });
    }

    const { email, newPassword, otp } = validationResult.data;

    if (!email || !newPassword || !otp) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Invaluid details, please enter valid detail",
        });
    }

    const result = await verifyOtp({
      identifier: email,
      purpose: "RESET_PASSWORD",
      otp,
    });

    if (!result.valid) {
      return res.status(400).json({ success: false, msg: result.reason });
    }

    const exitingUser = await findUserByEmail(email);

    if (!exitingUser) {
      return res
        .status(400)
        .json({
          success: false,
          msg: `User with this email ${email} is not exits`,
        });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const [updatedUser] = await db
      .update(Users)
      .set({
        password: hashedPassword,
      })
      .where(eq(Users.email, email))
      .returning({
        id: Users.id,
        name: Users.name,
        email: Users.email,
      });

    await sendPasswordRestAlertEmail(exitingUser.name, email);

    return res.status(200).json({
      success: true,
      msg: `Password updated successfully, new password is ${newPassword}`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Server error ", error.message);
    return res.status(500).json({ msg: "Server error", error: error.message });
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
          seccess: false,
          msg: "Please enter valid details",
          errror: validationResult.error,
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

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken, sid } = req.cookies || req.body;

    if (refreshToken && sid) {
      console.log("refresh token and sid");

      const [session] = await db
        .select()
        .from(UserSessions)
        .where(eq(UserSessions.id, sid));

      if (session && session.isActive) {
        console.log("session and active");

        const isValid = await argon2.verify(session.refreshToken, refreshToken);

        if (isValid) {
          console.log("isValid");

          await db
            .update(UserSessions)
            .set({
              isActive: false,
              revokedAt: new Date(),
            })
            .where(eq(UserSessions.id, sid));
        }
      }
    }

    res.clearCookie("sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
};

export const terminateAllOtherDevice = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { refreshToken, sid } = req.cookies;

    if (!sid || !refreshToken) {
      return res.status(400).json({ success: false, msg: "Session not found" });
    }

    if (sid && refreshToken) {
      const [activeSession] = await db
        .select()
        .from(UserSessions)
        .where(
          and(
            eq(UserSessions.id, sid),
            eq(UserSessions.userId, user.id),
            eq(UserSessions.isActive, true)
          )
        );

      if (!activeSession) {
        return res.status(401).json({
          success: false,
          msg: "Invalid or expired session",
        });
      }

      const isValid = await argon2.verify(
        activeSession.refreshToken,
        refreshToken
      );

      if (isValid) {
        await db
          .update(UserSessions)
          .set({
            isActive: false,
            revokedAt: new Date(),
          })
          .where(
            and(
              eq(UserSessions.userId, user.id),
              ne(UserSessions.id, sid),
              eq(UserSessions.isActive, true)
            )
          );
      }
    }

    return res.status(200).json({
      success: true,
      message: "All other devices logged out successfully",
    });
  } catch (error: any) {
    console.error("Terminate devices error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const user = req.user;

   if (!user?.id) {
  return res.status(401).json({ success: false, msg: "Unauthorized" });
}


    const { refreshToken:incomingRefreshToken, sid } = req.cookies;

      if (!incomingRefreshToken || !sid) {
      return res.status(401).json({ success: false, msg: "Missing tokens" });
    }
    
      
      const [session] = await db
        .select()
        .from(UserSessions)
        .where(
          and(
            eq(UserSessions.id, sid),
            eq(UserSessions.userId, user?.id),
            eq(UserSessions.isActive, true)
          )
        );

         if (!session) {
       return res.status(401).json({ success: false, msg: "Session not found" });
      }

      const isValid = await argon2.verify(
        session.refreshToken,
        incomingRefreshToken
      )

      if(!isValid){
        await db.update(UserSessions)
        .set({
          isActive : false,
          revokedAt : new Date()
        })
        .where(eq(UserSessions.id, sid))

        
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

        return res.status(401).json({
          success: false,
          msg: "Refresh token compromised"
        })
      }

      
        const newAccessToken = await generateAccessToken(user.id, user.email);
        const newRefreshToken = await generateRefreshToken(user.id, user.email);

        const newHashedRefreshToken = await argon2.hash(newRefreshToken as string);

        await db
          .update(UserSessions)
          .set({
            refreshToken: newHashedRefreshToken,
            lastUsedAt : new Date(),
          })
          .where(
            and(
               eq(UserSessions.id, sid),
        eq(UserSessions.userId, user.id),
    eq(UserSessions.isActive, true)
            )
          );

        return res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        success: true,
        msg: "Token rotated successfully",
      });
      
   
  } catch (error: any) {
    console.error("Refresh token error error:", error.message);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
