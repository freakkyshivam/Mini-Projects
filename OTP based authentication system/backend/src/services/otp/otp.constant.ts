 

export const OTP_TTL = 300;  
export const OTP_LENGTH = 6;
export const MAX_OTP_ATTEMPTS = 5;

export const getOtpKey = (
  email: string,
  purpose: string
) => `otp:${purpose}:${email}`;
