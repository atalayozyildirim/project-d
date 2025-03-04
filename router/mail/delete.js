import express from "express";
import MailData from "../../db/Model/MailData.js";
const router = express.Router();

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;

  const mailD = await MailData.findOne({ id });

  if (!mailD) {
    return res.status(404).json({ message: "Mail Service not found !" });
  }

  await MailData.deleteOne({ id });
  return res
    .status(200)
    .json({ message: "Mail Service deleted successfully !" });
});

export default router;
