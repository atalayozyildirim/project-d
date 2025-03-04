import express from "express";
import MailData from "../../db/Model/MailData.js";
import imaps from "imap-simple";
import { simpleParser } from "mailparser";

const router = express.Router();

router.get("inbox/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is required!" });
    }

    const mailData = await MailData.findById({ userId: id });
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

    const connect = await imaps.connect(config);

    await connect.openBox("INBOX");

    const searchCriteria = ["ALL"];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: true,
    };

    const messages = await connect.search(searchCriteria, fetchOptions);

    const emails = await Promise.all(
      message.map(async (item) => {
        const all = item.parts.find((part) => part.which === "TEXT");
        const id = item.attributes.uid;
        const idHeader = "Imap-Id: " + id + "\r\n";
        const mail = await simpleParser(idHeader + all.body);

        return {
          id,
          subject: mail.subject,
          from: mail.from.text,
          text: mail.text,
          html: mail.html,
        };
      })
    );
    await connect.end();
    res.status(200).json(emails);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;
