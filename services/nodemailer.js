import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (token, email) => {
  try {
    const info = await transporter.sendMail({
      from: "<krishnakanjani2@gmail.com>", // sender address
      to: email, // list of recipients
      subject: "emial verification", // subject line
      text: "Hello world?", // plain text body
      html: `<b>Verify your email :http://localhost:/3000/verify_email${token}</b>`, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

export default sendEmail;
