import nodemailer  from 'nodemailer'
import type { Transporter } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
      port: 587,
    secure: false,  
    auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD,
  },
})


export default transporter