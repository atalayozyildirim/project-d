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
  [
    body("to").isEmail().withMessage("Geçerli bir e-posta adresi giriniz"),
    body("subject").isString().notEmpty().withMessage("Konu boş olamaz"),
    body("text").isString().notEmpty().withMessage("Mesaj içeriği boş olamaz"),
  ],
  async (req, res) => {
    try {
      const err = validationResult(req);
      if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
      }

      const emailData = await EmailData.findOne({
        userId: req.currentUser.user.id,
      });

      if (!emailData) {
        return res.status(404).json({ message: "E-posta servisi bulunamadı!" });
      }

      const transporter = nodemailer.createTransport({
        host: emailData.host,
        port: emailData.port,
        secure: emailData.port === 465,
        auth: {
          user: emailData.user,
          pass: emailData.password,
        },
        debug: true,
        logger: true,
      });

      console.log("SMTP Ayarları:", {
        host: emailData.host,
        port: emailData.port,
        secure: emailData.port === 465,
        user: emailData.user,
        from: emailData.from,
      });

      try {
        await transporter.verify();
        console.log("SMTP Bağlantısı başarılı!");
      } catch (verifyError) {
        console.error("SMTP Bağlantı hatası:", verifyError);
        return res.status(500).json({
          message: "SMTP sunucusuna bağlanılamadı",
          error: verifyError.message,
        });
      }

      const { to, subject, text } = req.body;

      console.log("Gönderilecek e-posta detayları:", {
        from: emailData.from,
        to,
        subject,
      });

      const info = await transporter.sendMail({
        from: emailData.from,
        to,
        subject,
        text,
      });

      console.log("E-posta gönderildi:", {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      });

      return res.status(200).json({
        message: "E-posta başarıyla gönderildi!",
        messageId: info.messageId,
      });
    } catch (error) {
      console.error("E-posta gönderme hatası:", error);
      return res.status(500).json({
        message: "E-posta gönderilirken bir hata oluştu",
        error: error.message,
      });
    }
  }
);

export default router;
