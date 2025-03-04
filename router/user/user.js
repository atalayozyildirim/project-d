import express from "express";
import userAdd from "./add.js";
import me from "./me.js";
import deleteUser from "./deleteUser.js";

const router = express.Router();

router.use("/", userAdd);
router.use("/", me);
router.use("/", deleteUser);

export default router;
