import express from "express";
import ImapEmail from "../../db/Model/ImapEmail.js";
import imaps from "imap-simple";
import { simpleParser } from "mailparser";

const router = express.Router();

router.get("/inbox", async (req, res) => {
  try {
    const mailData = await ImapEmail.findOne({
      userId: req.currentUser.user.id,
    });

    if (!mailData) {
      return res.status(404).json({ message: "Mail data not found!" });
    }

    const config = {
      imap: {
        user: mailData.user,
        password: mailData.password,
        host: mailData.host,
        port: mailData.port,
        tls: true,
        authTimeout: 3000,
      },
    };

    console.log("IMAP Bağlantı Ayarları:", {
      host: mailData.host,
      port: mailData.port,
      user: mailData.user,
      // Güvenlik için şifreyi loglamıyoruz
    });

    let connection;

    if (!global.imapConnection) {
      console.log("Yeni IMAP bağlantısı oluşturuluyor...");
      connection = await imaps.connect(config);
      global.imapConnection = connection;
      console.log("IMAP bağlantısı başarılı");
    } else {
      console.log("Mevcut IMAP bağlantısı kullanılıyor");
      connection = global.imapConnection;
    }

    console.log("INBOX açılıyor...");
    await connection.openBox("INBOX");
    console.log("INBOX başarıyla açıldı");

    const searchCriteria = ["ALL"];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: true,
      struct: true,
      limit: 50,
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const emails = await Promise.all(
      messages.map(async (item) => {
        const all = item.parts.find((part) => part.which === "TEXT");
        if (!all) {
          return null;
        }
        const id = item.attributes.uid;
        const idHeader = "Imap-Id: " + id + "\r\n";
        const mail = await simpleParser(idHeader + all.body);

        return {
          id,
          subject: mail.subject || "(No Subject)",
          from: mail.from ? mail.from.text : "(No Sender)",
          text: mail.text || "",
          html: mail.html || "",
        };
      })
    ).catch((err) => console.log(err));

    await connection.end();
    res.status(200).json(emails);
  } catch (error) {
    console.error("Mail alma hatası:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
});

export default router;
