import express from "express";
import { body, validationResult } from "express-validator";
import MailData from "../../db/Model/MailData.js";

const router = express.Router();

router.get(
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

    const mail = new MailData({
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
