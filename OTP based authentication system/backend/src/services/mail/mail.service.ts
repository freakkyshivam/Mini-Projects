 
import transporter from "../../config/nodemailer";
import {
   accountVerificationTemplate,
   passwordResetTemplate,
   passwordResetAlertTemplate,
   twoFactorAuthTemplate
   } from "./mail.templates";

 

export async function sendRegisterAccountVerifyEmail(
  name: string | undefined,
  email: string,
  otp: string
) {
  const template = accountVerificationTemplate({ name, otp });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendPasswordRestEmail(
  name: string | undefined,
  email: string,
  otp: string
) {
  const template = passwordResetTemplate({ name, otp });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendPasswordRestAlertEmail(
  name: string | undefined,
  email: string,
) {
  const template = passwordResetAlertTemplate({ name });

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}

export async function sendTwoFactorAuthEmail(
  name: string | undefined,
  email: string,
  otp: string
) {
  const template = twoFactorAuthTemplate( {name,otp} );

  const info = await transporter.sendMail({
    from: `"Shivam Chaudhary" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  return info.messageId;
}