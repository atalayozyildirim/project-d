import express from "express";
import addEmployer from "./add.js";
import getEmployer from "./all.js";
import deleteEmployer from "./delete.js";

const router = express.Router();

router.use("/", addEmployer);
router.use("/", getEmployer);
router.use("/", deleteEmployer);

export default router;
