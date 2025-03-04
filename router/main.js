import express from "express";
import authRouter from "./auth/auth.js";
import userRouter from "./user/user.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
