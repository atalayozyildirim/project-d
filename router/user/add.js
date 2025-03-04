import express from "express";
import { body } from "express-validator";
import UserModel from "../../db/Model/UserModel.js";

const router = express.Router();

router.post("/add", [body("name").isString().notEmpty()], async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { name, email } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return res.status(400).json({ error: "User already exist" });
    }
    const user = new UserModel({
      name,
      email,
    });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal server error");
  }
});

export default router;
