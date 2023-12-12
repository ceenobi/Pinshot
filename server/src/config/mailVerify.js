import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import env from "../utils/validateEnv.js";

const sendEmail = async ({ from, to, subject, text, userName}) => {
  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Pinshot",
      link: "https://mailgen.js/",
    },
  });

  var email = {
    body: {
      name: userName,
      intro: text || "Welcome to Pinshot!.",
      outro:
        "Need help? simply reply to this mail and have your questions answered.",
    },
  };
  var emailBody = mailGenerator.generate(email);

  try {
    let mailOptions = {
      from,
      to,
      subject,
      html: emailBody,
    };
    const transporter = nodemailer.createTransport({
      host: env.HOST,
      port: 587,
      auth: {
        user: env.USERMAIL,
        pass: env.BREVOMAILKEY,
      },
    });
    await transporter.sendMail(mailOptions);
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

export default sendEmail;
