import express from "express";
import { body, validationResult } from "express-validator";
import CustomerModel from "../../db/Model/CustomerModel.js";
const router = express.Router();

router.post(
  "/add",
  [
    body("name").isString().withMessage("Email required !"),
    body("email").isEmail().withMessage("Email required !"),
    body("company").isString().withMessage("Company required !"),
    body("phone").isString().withMessage("Phone required !"),
    body("address").isString().withMessage("Address required !"),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { name, email, company, phone, address } = req.body;

    const existCustomer = await CustomerModel.findOne({ email });

    if (existCustomer) {
      return res.status(400).json({ error: "Customer already exists !" });
    }
    const newCustomer = new CustomerModel({
      name,
      email,
      company,
      phone,
      address,
    });
    await newCustomer.save();

    return res
      .status(201)
      .json({ message: "Customer added successfully !", data: newCustomer });
  }
);

export default router;
