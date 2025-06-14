import express from "express";
import Task from "../../db/Model/Task.js";
import UserModel from "../../db/Model/UserModel.js";
import { body, validationResult } from "express-validator";
import { MyWebSocketInstance } from "../../lib/websocket/webSocket.js";
const router = express.Router();

router.post(
  "/add",
  [
    body("title")
      .isString()
      .notEmpty()
      .escape()
      .withMessage("Title required !"),
    body("priority")
      .isIn(["low", "medium", "high"])
      .escape()
      .withMessage("Priority required value [low,high,medium] !"),
    body("assignedTo")
      .isMongoId()
      .escape()
      .notEmpty()
      .withMessage("AssignedTo required  Mongo Object ID!"),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("Description required !"),
    body("status")
      .isString()
      .notEmpty()
      .escape()
      .withMessage("Status required !"),
    body("dueDate")
      .isDate()
      .notEmpty()
      .escape()
      .withMessage("Due Date required !"),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    try {
      const { title, description, status, dueDate, assignedTo, priority } =
        req.body;

      const user = await UserModel.findById(assignedTo);
      if (!user) {
        return res.status(404).json({ message: "User not found !" });
      }

      const task = new Task({
        title,
        description,
        status,
        dueDate,
        assignedTo,
        priority,
      });

      console.log("task", user.userId.valueOf());
      await MyWebSocketInstance.sendNotification(
        {
          title: "You have been assigned a new task",
          message: `Task ${task.title} has been assigned to you`,
        },
        user.userId.valueOf()
      );
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error Server !" });
    }
  }
);

router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("assignedTo");
    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found !" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error Server !" });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found !" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error Server !" });
  }
});

router.put(
  "/update/:id",
  [
    body("Status")
      .isString()
      .notEmpty()
      .isIn(["pendig", "completed", "in progress"])
      .escape()
      .withMessage("Status required !"),
  ],
  async (req, res) => {
    try {
      const task = await Task.findById({ _id: req.params.id });

      if (!task) {
        return res.status(404).json({ message: "Task not found !" });
      }

      task.status = req.body.status;

      const message = {
        title: "Task status updated",
        message: `Task ${task.title} status has been updated to ${
          task.status == "completed" ? "completed" : "in progress"
        }`,
      };
      await MyWebSocketInstance.sendNotification(message, task.assignedTo);

      await task.save();

      res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: "Error Server !" });
    }
  }
);

router.get("/user/list", async (req, res) => {
  const data = await UserModel.find({}).select("name");

  if (!data) {
    return res.status(404).json({ message: "Users not found !" });
  }

  res.status(200).json(data);
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found !" });
    }
    res.status(200).json({ message: "Task deleted !" });
  } catch (error) {
    res.status(500).json({ message: "Error Server !" });
  }
});

export default router;
