import express from "express";
import Invoice from "../../db/Model/InvoiceModel.js";
import CustomerModel from "../../db/Model/CustomerModel.js";
import Personel from "../../db/Model/Personel.js";
import Task from "../../db/Model/Task.js";
import { param, validationResult } from "express-validator";

const router = express.Router();

router.get(
  "/:field/:value",
  param("field").isString().escape(),
  param("value").isString().isLength({ min: 1 }).trim().escape(),

  async (req, res) => {
    const { field, value } = req.params;

    if (!validationResult(req)) {
      return res.status(400).json({ error: "Invalid search parameters" });
    }
    try {
      let results = [];
      const sanitizedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      switch (field) {
        case "invoice":
          results = await Invoice.find({
            $or: [
              { invoiceNumber: { $regex: sanitizedValue, $options: "i" } },
              { customerName: { $regex: sanitizedValue, $options: "i" } },
              { status: { $regex: sanitizedValue, $options: "i" } },
            ],
          });
          break;
        case "customers":
          results = await CustomerModel.find({
            $or: [
              { name: { $regex: sanitizedValue, $options: "i" } },
              { email: { $regex: sanitizedValue, $options: "i" } },
              { phone: { $regex: sanitizedValue, $options: "i" } },
              { address: { $regex: sanitizedValue, $options: "i" } },
            ],
          });
          break;
        case "employers":
          results = await Personel.find({
            $or: [
              { name: { $regex: sanitizedValue, $options: "i" } },
              { email: { $regex: sanitizedValue, $options: "i" } },
              { phone: { $regex: sanitizedValue, $options: "i" } },
              { address: { $regex: sanitizedValue, $options: "i" } },
            ],
          });
          break;
        case "tasks":
          results = await Task.find({
            $or: [
              { title: { $regex: sanitizedValue, $options: "i" } },
              { description: { $regex: sanitizedValue, $options: "i" } },
              { status: { $regex: sanitizedValue, $options: "i" } },
            ],
          });
          break;
        default:
          return res.status(400).json({ error: "Invalid search field" });
      }

      if (results.length == 0)
        return res.status(400).json({ error: "No results found" });

      return res.status(200).json({ results });
    } catch (error) {
      console.error("Error searching:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
