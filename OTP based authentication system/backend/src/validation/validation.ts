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
