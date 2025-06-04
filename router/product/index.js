import express from "express";
import Product from "../../db/Model/ProductModel.js";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Name cannot be empty").escape(),
    body("price").isNumeric().withMessage("Price must be a number").escape(),
    body("description").optional().isString().escape(),
    body("stock").optional().isNumeric().escape(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, stock } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      stock,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      data: newProduct,
    });
  }
);

router.get("/list", async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});
export default router;
