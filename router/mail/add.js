import express from "express";
import { body, validationResult } from "express-validator";
import MailData from "../../db/Model/MailData.js";
import ImapEmail from "../../db/Model/ImapEmail.js";

const router = express.Router();

router.post(
  "/imap/add",
  body("host").isString().notEmpty().withMessage("Host not valid !"),
  body("port").isInt().notEmpty().withMessage("Port not valid !"),
  body("user").isString().notEmpty().withMessage("User not valid !"),
  body("password").isString().notEmpty().withMessage("Password not valid !"),
  async (req, res) => {
    const err = validationResult(req);
    try {
      if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
      }

      const { user, password, host, port } = req.body;

      const existImap = await ImapEmail.findOne({ user });
      if (existImap) {
        return res
          .status(400)
          .json({ errors: [{ msg: "IMAP Email Service already exist !" }] });
      }
      const mail = new ImapEmail({
        userId: req.currentUser.user.id,
        user,
        password,
        host,
        port,
      });

      await mail.save();

      return res
        .status(201)
        .json({ message: "IMAP Email Service added successfully !" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);
router.post(
  "/add",
  [
    body("host").isString().notEmpty().withMessage("Host not valid !"),
    body("port").isInt().notEmpty().withMessage("Port not valid !"),
    body("user").isString().notEmpty().withMessage("User not valid !"),
    body("password").isString().notEmpty().withMessage("Password not valid !"),
    body("from").isString().notEmpty().withMessage("From not valid !"),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }

    const { user, password, host, port, from } = req.body;

    const exist = await MailData.findOne({ userId: req.currentUser.user.id });
    if (exist) {
      return res.status(400).json({ message: "Mail Service already exist !" });
    }
    const mail = new MailData({
      userId: req.currentUser.user.id,
      user,
      password,
      host,
      port,
      from,
    });

    await mail.save();

    return res
      .status(201)
      .json({ message: "Mail Service added successfully !" });
  }
);

export default router;
