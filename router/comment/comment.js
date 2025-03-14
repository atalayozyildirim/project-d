import express from "express";
import { body, param, validationResult } from "express-validator";
import Task from "../../db/Model/Task.js";

const router = express.Router();

router.get(
  "/get/:id",
  param("id").isMongoId().withMessage("Not valid params"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const commentTask = await Task.findById(req.params.id);

      if (!commentTask) {
        return res.status(400).json({ message: "Task not found" });
      }

      return res.status(200).json({ data: commentTask.comments });
    } catch {
      return res.status(400).json({ message: "error" });
    }
  }
);

router.post(
  "/add",
  [
    body("taskId").isMongoId().withMessage("Not valid is task id"),
    body("userId").isMongoId().withMessage("Not valid is user id"),
    body("comment").isString().withMessage("Not valid is comment type"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId, userId, comment } = req.body;

    try {
      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(400).json({ message: "Task not found" });
      }

      task.comments.push({ user: userId, comment });

      await task.save();

      res.status(201).json({ message: "Comment added", data: task.comments });
    } catch (err) {
      return res.status(400).json({ message: "Task not found" });
    }
  }
);

router.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Not valid params ")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const Comment = await Task.findById(req.params.id);

      if (!Comment) {
        return res.status(400).json({ message: "Task not found" });
      }

      const commentIndex = Comment.comments.findIndex(
        (comment) => comment._id.toString() == req.params.id
      );

      if (commentIndex === -1) {
        return res.status(400).json({ message: "Comment not found" });
      }

      Comment.comments.splice(commentIndex, 1);
      await Comment.save();

      return res.status(200).json({ message: "Comment deleted" });
    } catch {
      return res.status(400).json({ message: "error " });
    }
  }
);
export default router;
