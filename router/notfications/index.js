import express from "express";
import Notifications from "../../db/Model/NotificationsModel.js";
import { body, validationResult } from "express-validator";
import {
  MyWebSocket,
  MyWebSocketInstance,
} from "../../lib/websocket/webSocket.js";

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const userId = req.currentUser.user.id;
    console.log("userId", userId);

    if (!userId) {
      return res.status(401).send({ message: "Not authorized" });
    }
    const notifications = await Notifications.find({ userId: userId });

    await MyWebSocketInstance.sendNotification(notifications, userId);
    return res.status(200).json({ notifications });
  } catch (err) {
    console.log("Error: " + err);
  }
});

router.post("/read/:id", async (req, res) => {
  try {
    const notification = await Notifications.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.userId != req.currentUser.user.id) {
      return res.status(401).json({
        message: "Notified user is different from the authenticated user",
      });
    }

    notification.status = "read";

    await notification.save();

    return res.status(200).json({ message: "Notification read" });
  } catch (err) {
    console.log("Error: " + err);
  }
});

router.post(
  "/create",
  [
    body("title").isString().notEmpty().withMessage("Title is required !"),
    body("message").isString().notEmpty().withMessage("Message is required !"),
  ],
  async (req, res) => {
    try {
      const err = validationResult(req);

      if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
      }

      const { message, title, userId } = req.body;

      const existNotf = await Notifications.findOne({
        title: title,
        message: message,
      });
      if (existNotf) {
        return res.status(400).json({ message: "Notification already exist" });
      }

      const notification = new Notifications({
        title,
        message,
        userId,
      });

      await notification.save();

      MyWebSocketInstance.sendNotification(notification, userId);
      return res
        .status(200)
        .json({ message: "Notification created successfully" });
    } catch (err) {
      console.log("Error: " + err);
    }
  }
);
export default router;
