import express from "express";
import loginUser from "./login.js";
import registerUser from "./register.js";
import resetPassword from "./resetPassword.js";

const router = express.Router();

router.use("/", loginUser);
router.use("/", registerUser);
router.use("/", resetPassword);

export default router;
