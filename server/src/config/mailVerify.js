import nodemailer from 'nodemailer'
import env from '../utils/validateEnv.js'

const sendEmail = async ({ from, to, subject, text }) => {
  try {
    let mailOptions = {
      from,
      to,
      subject,
      text,
    }
    const transporter = nodemailer.createTransport({
      host: env.HOST,
      port: 587,
      auth: {
        user: env.USERMAIL,
        pass: env.BREVOMAILKEY,
      },
    });
    await transporter.sendMail(mailOptions)
    console.log('email sent sucessfully')
  } catch (error) {
    console.log('email not sent')
    console.log(error)
  }
}

export default sendEmail
