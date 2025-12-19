import argon2 from "argon2";

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOTP(otp: string): Promise<string> {
  return argon2.hash(otp);
}

export async function verifyOTP(
  hashedOtp: string,
  otp: string
): Promise<boolean> {
  return argon2.verify(hashedOtp, otp);
}
