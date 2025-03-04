import express from "express";

import InvoiceModel from "../../db/Model/InvoiceModel.js";

const router = express.Router();

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const invoice = await Invoice.findOne({ id });
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  await InvoiceModel.deleteOne({ id });
  res.status(200).json({ message: "Invoice deleted" });
});

export default router;
