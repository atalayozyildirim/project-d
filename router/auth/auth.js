import express from "express";
import loginUser from "./login.js";
import registerUser from "./register.js";
const router = express.Router();

router.use("/", loginUser);
router.use("/", registerUser);

export default router;
