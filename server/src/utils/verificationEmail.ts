import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nikeshsapkota2021@gmail.com", // replace with your Gmail email
    pass: "fxtl sxvi ssmz hyvt", // replace with your Gmail password or app-specific password
  },
});

export const sendVerificationEmail = async (
  to: string,
  verificationToken: string
) => {
  const mailOptions = {
    from: "nikeshsapkota2021@gmail.com",
    to,
    subject: "Email Verification",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <h2 style="color: #333;">Thank You for Registering!</h2>
      <p style="color: #555;">Welcome to CoSketch.</p>
      <p style="color: #555;">To verify your email, please click the following link:</p>
      <a href="http://localhost:5173/verify-email?token=${verificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p style="color: #555;">If you didn't register for our system, you can ignore this email.</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
