import express from "express";

import InvoiceModel from "../../db/Model/InvoiceModel.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }
    const data = await InvoiceModel.find({ _id: id });

    if (!data) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
