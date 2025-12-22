
import {redis} from '../../config/redis.js'
import {generateOtp, hashOtp, compareOtp} from '../../utils/otp.js'
import { OTP_TTL,MAX_OTP_ATTEMPTS,getOtpKey } from './otp.constant.js'

import {SendOtpInput,VerifyOtpInput,VerifyOtpResult} from "./otp.types.js"

export async function sendOtp({
    identifier,
    purpose,
    ttl = OTP_TTL
}:SendOtpInput):Promise<string> {
    const otp = generateOtp();
    const hashedOtp = hashOtp(otp);

    const key = getOtpKey(identifier, purpose);

    await redis.set(
        key,
        JSON.stringify({
            hashedOtp,
            attempt : 0
        }),
        {EX: ttl,}
    );
    return otp;
}

export async function verifyOtp({
  identifier,
  purpose,
  otp,
}: VerifyOtpInput): Promise<VerifyOtpResult> {
  const key = getOtpKey(identifier, purpose);

  const raw = await redis.get(key);

  if (!raw) {
    return { valid: false, reason: "EXPIRED" };
  }

  const data = JSON.parse(raw);

  if (data.attempts >= MAX_OTP_ATTEMPTS) {
    await redis.del(key);
    return { valid: false, reason: "TOO_MANY_ATTEMPTS" };
  }

  const isValid = compareOtp(otp, data.hashedOtp);

  if (!isValid) {
    data.attempts += 1;
    await redis.set(key, JSON.stringify(data),{
        KEEPTTL : true
    });
    return { valid: false, reason: "INVALID" };
  }

  await redis.del(key);
  return { valid: true };
}

