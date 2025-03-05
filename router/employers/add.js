import express from "express";
import EmployersModel from "../../db/Model/Personel.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/add",
  [
    body("name").isString().notEmpty().withMessage("Name is required"),
    body("surname").isString().notEmpty().withMessage("Surname is required"),
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("phone").isString().notEmpty().withMessage("Phone is required"),
    body("salary").isNumeric().notEmpty().withMessage("Salary is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, phone, salary } = req.body;

    const exists = await EmployersModel.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newEmployer = new EmployersModel({
      name,
      surname,
      email,
      phone,
      salary,
    });

    await newEmployer.save();

    res.status(201).json({ data: newEmployer, message: "Employer added" });
  }
);

export default router;
