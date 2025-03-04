import express from "express";
import userAdd from "./add.js";
import me from "./me.js";

const router = express.Router();

router.use("/", userAdd);
router.use("/", me);

export default router;
