import express from "express";
import { body, validationResult } from "express-validator";

import InvoiceModel from "../../db/Model/InvoiceModel.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await InvoiceModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalInvoice = await InvoiceModel.countDocuments();
    const totalPages = Math.ceil(totalInvoice / limit);

    res.json({
      users,
      totalPages,
      currentPage: page,
      totalInvoice,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
