import express from "express";
import { body, validationResult } from "express-validator";
import MailData from "../../db/Model/MailData.js";

const router = express.Router();
// atalay ozyildirim :)
router.patch(
  "/update/:id",
  [
    body("user").optional().isString(),
    body("password").optional().isString(),
    body("host").optional().isString(),
    body("port").optional().isInt(),
    body("from").optional().isString(),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { user, password, host, port, from } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required!" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updateData = {};
    if (user) updateData.user = user;
    if (password) updateData.password = password;
    if (host) updateData.host = host;
    if (port) updateData.port = port;
    if (from) updateData.from = from;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data to update!" });
    }

    try {
      const updatedMailData = await MailData.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedMailData) {
        return res.status(404).json({ message: "Mail data not found!" });
      }
      res.json(updatedMailData);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default router;
