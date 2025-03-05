import express from "express";
import EmailData from "../../db/Model/MailData.js";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post("/testEmail", async (req, res) => {
  try {
    // Ethereal Email account creation
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const { to, subject, text } = req.body;

    const info = await transporter.sendMail({
      from: '"Sender Name" <sender@example.com>',
      to,
      subject,
      text,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.status(200).json({
      message: "Email sent successfully!",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});
router.post(
  "/sendEmail",
  [body("to").isString(), body("subject").isString(), body("text").isString()],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    const emailData = await EmailData.findOne({
      userId: req.currentUser.user.id,
    });

    console.log(emailData);
    if (!emailData)
      return res.status(404).json({ message: "Email Services not found !" });

    const transporter = nodemailer.createTransport({
      host: emailData.host,
      port: emailData.port,
      secure: false,
      auth: {
        user: emailData.user,
        pass: emailData.password,
      },
    });

    const { to, subject, text } = req.body;

    const info = await transporter
      .sendMail({
        from: emailData.from,
        to,
        subject,
        text,
      })
      .then(() => {
        return res.status(200).json({ message: "Email sent successfully !" });
      })
      .catch((error) => {
        return res.status(500).json({ message: "Server error", error });
      });
  }
);

export default router;
