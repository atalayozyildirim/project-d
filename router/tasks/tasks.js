import express from "express";
import Task from "../../db/Model/Task.js";
import { body, validationResult } from "express-validator";
import { MyWebSocketInstance } from "../../lib/websocket/webSocket.js";
const router = express.Router();

router.post(
  "/add",
  [
    body("title").isString().notEmpty().withMessage("Title required !"),
    body("priority")
      .isIn(["low", "medium", "high"])
      .withMessage("Priority required value [low,high,medium] !"),
    body("assignedTo")
      .isMongoId()
      .notEmpty()
      .withMessage("AssignedTo required  Mongo Object ID!"),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("Description required !"),
    body("status").isString().notEmpty().withMessage("Status required !"),
    body("dueDate").isDate().notEmpty().withMessage("Due Date required !"),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ errors: err.array() });
    }
    try {
      const { title, description, status, dueDate, assignedTo, priority } =
        req.body;

      const task = new Task({
        title,
        description,
        status,
        dueDate,
        assignedTo,
        priority,
      });

      await MyWebSocketInstance.sendNotification(
        {
          title: "You have been assigned a new task",
          message: `Task ${task.title} has been assigned to you`,
        },
        assignedTo
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
    const tasks = await Task.find();
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
