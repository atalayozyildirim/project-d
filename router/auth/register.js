import express from "express";
import Auth from "../../db/Model/AuthModel.js";
import UserModel from "../../db/Model/UserModel.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    body("email").notEmpty().isEmail().withMessage("Email cannot be empty"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const userExists = await Auth.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = new Auth({
        name,
        email,
        password,
      });
      await user.save();

      const userModelinSave = await new UserModel({
        name,
        email,
      });

      await userModelinSave.save();

      res
        .status(201)
        .json({ message: "User created successfully ", redirect: "/login" });
    } catch (error) {
      console.log("Error: ", error);
    }
  }
);

export default router;
