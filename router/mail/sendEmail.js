import express from "express";
import EmailData from "../../db/Model/MailData.js";
import nodemailler from "nodemailer";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/sendEmail/:id",
  [body("to").isString(), body("subject").isString(), body("text").isString()],
  async (req, res) => {
    const { id } = req.params;

    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    const emailData = await EmailData.findB({ userId: id });

    if (!emailData)
      return res.status(404).json({ message: "Email Services not found !" });

    const transporter = nodemailler.createTransport({
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
