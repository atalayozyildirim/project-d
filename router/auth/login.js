import express from "express";
import bcrypt from "bcrypt";
import Auth from "../../db/Model/AuthModel.js";
import { body, validationResult } from "express-validator";
import { generateJWT, refreshToken } from "../../util/generateJWT.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const findUser = await Auth.findOne({ email });

    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateJWT(findUser._id);

    const refresh_token = await refreshToken(token);

    res.cookie("acsess_token", "Bearer " + token, { httpOnly: true });
    res.cookie("refresh_token", "Bearer " + refresh_token, { httpOnly: true });

    res.json({
      user: {
        id: findUser._id,
        email: findUser.email,
        token,
        refresh_token,
      },
      redirect: "/home",
    });
  }
);

export default router;
