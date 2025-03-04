import express from "express";

import { body, validationResult } from "express-validator";

import InvoiceModel from "../../db/Model/InvoiceModel.js";

const router = express.Router();

router.post(
  "/add",
  [
    body("invoiceNumber")
      .isString()
      .notEmpty()
      .withMessage("Invoice number is required"),
    body("invoiceDate")
      .isDate()
      .notEmpty()
      .withMessage("Invoice date is required"),
    body("customerName")
      .isString()
      .notEmpty()
      .withMessage("CustomerName is required"),
    body("customerAddress")
      .isString()
      .notEmpty()
      .withMessage("Customer address is required"),
    body("items").isArray().notEmpty().withMessage("Items is required"),
    body("total").isNumeric().notEmpty().withMessage("Total is required"),
    body("status").isString().notEmpty().withMessage("Status is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      items,
      total,
      status,
    } = req.body;

    const existingInvoice = await InvoiceModel.findOne({ invoiceNumber });

    if (existingInvoice) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invoice already exists" }] });
    }

    const newInvoice = new InvoiceModel({
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      items,
      total,
      status,
    });
    await newInvoice.save();

    return res
      .status(201)
      .json({ message: "Invoice added successfully", data: newInvoice });
  }
);

export default router;
