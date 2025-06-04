import express from "express";
import authRouter from "./auth/auth.js";
import userRouter from "./user/user.js";
import employerRouter from "./employers/employers.js";
import customerRouter from "./customer/customer.js";
import invoiceRouter from "./invoice/invoice.js";
import mailRouter from "./mail/mail.js";
import charts from "./chart/chart.js";
import taskRouter from "./tasks/tasks.js";
import commentRouter from "./comment/comment.js";
import aiRouter from "./ai/index.js";
import notification from "./notfications/index.js";
import search from "./search/index.js";
import Product from "./product/index.js";
import { currentUser } from "../middleware/currentUser.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", currentUser, userRouter);
router.use("/emp", currentUser, employerRouter);
router.use("/invoice", currentUser, invoiceRouter);
router.use("/customer", currentUser, customerRouter);
router.use("/charts", currentUser, charts);
router.use("/task", currentUser, taskRouter);
router.use("/comment", currentUser, commentRouter);
router.use("/ai", currentUser, aiRouter);
router.use("/mail", currentUser, mailRouter);
router.use("/notification", currentUser, notification);
router.use("/product", currentUser, Product);
router.use("/search", currentUser, search);

export default router;
