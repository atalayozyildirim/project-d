import express from "express";
import authRouter from "./auth/auth.js";
import userRouter from "./user/user.js";
import employerRouter from "./employers/employers.js";
import customerRouter from "./customer/customer.js";
import invoiceRouter from "./invoice/invoice.js";
import { currentUser } from "../middleware/currentUser.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", currentUser, userRouter);
router.use("/emp", currentUser, employerRouter);
router.use("/invoice", currentUser, invoiceRouter);
router.use("/customer", currentUser, customerRouter);

export default router;
