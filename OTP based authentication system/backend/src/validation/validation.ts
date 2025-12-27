import { email, z } from "zod";

export const signupValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  name: z
    .string()
    .trim()
    .min(1, "Name is required"),
});

export const loginValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});


export const otpVerificationForRegister = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

    otp : z
    .string()
    .trim()
    .min(6)
})

export const sendResetOtpValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
})

export const resetPasswordValidation = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

   otp : z
    .string()
    .trim()
    .min(6),

    newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),

})

export const changePasswordValiadtion = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

   newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})

export const updateNameValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required"),
})