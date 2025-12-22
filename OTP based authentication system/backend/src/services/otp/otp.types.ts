 
export type OtpPurpose =
  | "ACCOUNT_VERIFY"
  | "RESET_PASSWORD"
  | "TWO_FACTOR";

export interface SendOtpInput {
  identifier: string;  
  purpose: OtpPurpose;
  ttl?: number;
}

export interface VerifyOtpInput {
  identifier: string;
  purpose: OtpPurpose;
  otp: string;
}

export type VerifyOtpResult =
  | { valid: true }
  | { valid: false; reason: "INVALID" | "EXPIRED" | "TOO_MANY_ATTEMPTS" };
