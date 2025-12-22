 

export function accountVerificationTemplate({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return {
    subject: "Verify your account – OTP code",
    text: `Your verification code is ${otp}.
This code will expire in 5 minutes.

If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Account Verification</h2>
        <p>Hello ${name ?? "User"},</p>
        <p>Your One-Time Password (OTP) for account verification is:</p>

        <div style="font-size: 24px; font-weight: bold; margin: 16px 0;">
          ${otp}
        </div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>If you did not request this verification, you can safely ignore this email.</p>

        <hr />
        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply.
        </p>
      </div>
    `,
  };
}


export function passwordResetTemplate({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return {
    subject: "Password reset – OTP code",
     text: `Hello ${name ? ` ${name}` : "User"},

Your password reset OTP is ${otp}.
This code will expire in 5 minutes.

If you did not request this, please ignore this email.`,
     html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Password Reset</h2>

      <p>Hello ${name ? ` ${name}` : "User"},</p>

      <p>You requested to reset your password. Use the OTP below to proceed:</p>

      <div style="font-size: 24px; font-weight: bold; margin: 16px 0;">
        ${otp}
      </div>

      <p>This OTP is valid for <strong>5 minutes</strong>.</p>

      <p>If you did not request a password reset, you can safely ignore this email.</p>

      <hr />
      <p style="font-size: 12px; color: #777;">
        This is an automated message. Please do not reply.
      </p>
    </div>
  `,
  };
}

export function passwordResetAlertTemplate({
  name,
}: {
  name?: string;
}) {
  return {
    subject: "⚠️ Password Reset Successful",
    text: `Hello ${name ? name : "User"},

Your password has been successfully reset.

If you did not perform this action, please contact our support team immediately to secure your account.

This is an automated message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #16a34a;">Password Reset Successful</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          Your password has been <strong>successfully reset</strong>.
          You can now log in using your new password.
        </p>

        <p>
          If you did <strong>not</strong> perform this action, please contact our
          support team immediately to protect your account.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };
}

export function twoFactorAuthTemplate({
  name,
  otp,
}: {
  name?: string;
  otp: string;
}) {
  return {
    subject: "🔐 Your Two-Factor Authentication Code",
    text: `Hello ${name ? name : "User"},

Your Two-Factor Authentication (2FA) code is: ${otp}

This code is valid for 5 minutes.

If you did not try to sign in, please secure your account immediately.

This is an automated message. Please do not reply.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color:#2563eb;">Two-Factor Authentication</h2>

        <p>Hello ${name ? name : "User"},</p>

        <p>
          To complete your sign-in, please use the verification code below:
        </p>

        <div style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
          margin: 20px 0;
          color:#111;
        ">
          ${otp}
        </div>

        <p>
          This code will expire in <strong>5 minutes</strong>.
        </p>

        <p style="color:#b91c1c;">
          If you did not attempt to sign in, please change your password immediately.
        </p>

        <hr />

        <p style="font-size: 12px; color: #777;">
          This is an automated security email. Please do not reply.
        </p>
      </div>
    `,
  };
}

