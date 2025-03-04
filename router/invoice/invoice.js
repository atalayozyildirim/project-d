import express from "express";
import add from "./add.js";
import getAll from "./get.js";
import deleteInvoice from "./delete.js";

const router = express.Router();

router.use("/", add);
router.use("/", getAll);
router.use("/", deleteInvoice);

export default router;
