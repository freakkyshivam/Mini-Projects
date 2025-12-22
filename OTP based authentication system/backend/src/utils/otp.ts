 
import crypto from 'node:crypto'

export function generateOtp(length = 6): string {
  return crypto.randomInt(
    10 ** (length - 1),
    10 ** length
  ).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function compareOtp(
  plainOtp: string,
  hashedOtp: string
): boolean {
  return hashOtp(plainOtp) === hashedOtp;
}
