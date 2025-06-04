import express from "express";
import nodemailer from "nodemailer";
import AuthModel from "../../db/Model/AuthModel.js";
import { body, validationResult } from "express-validator";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/reset-password",
  [body("email").isEmail().withMessage("Not valid email").escape()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      const user = await AuthModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 3600000;

      user.reesetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;

      await user.save();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "demarcus.morissette31@ethereal.email",
          pass: "mkbq4mKkEdrA2j1tA7",
        },
      });

      const resetUrl = `http://localhost:3000/api/auth/reset-password/${resetToken}`;
      const mailOptions = {
        to: user.email,
        from: "your-email@gmail.com",
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset email sent!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await AuthModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been reset!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
export default router;
