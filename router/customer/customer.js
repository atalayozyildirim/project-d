import express from "express";
import add from "./add.js";
import deleteCustomer from "./delete.js";
import getAll from "./get.js";

const router = express.Router();

router.use("/", add);
router.use("/", getAll);
router.use("/", deleteCustomer);

export default router;
