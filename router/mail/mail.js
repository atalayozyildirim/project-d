import express from "express";
import add from "./add.js";
import deleteMail from "./delete.js";
import update from "./update.js";
import getEmail from "./getEmail.js";
import sendMail from "./sendEmail.js";
import { currentUser } from "../../middleware/currentUser.js";

const router = express.Router();

router.use("/", add);
router.use("/", deleteMail);
router.use("/", update);
router.use("/", getEmail);
router.use("/", sendMail);

export default router;
