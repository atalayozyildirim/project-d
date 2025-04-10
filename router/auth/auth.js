import express from "express";
import loginUser from "./login.js";
import registerUser from "./register.js";
import resetPassword from "./resetPassword.js";
import verify from "./verify.js";

const router = express.Router();

router.use("/", loginUser);
router.use("/", registerUser);
router.use("/", resetPassword);
router.use("/", verify);

export default router;
