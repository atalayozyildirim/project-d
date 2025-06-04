import express from "express";
import { param } from "express-validator";
import UserModel from "../../db/Model/UserModel.js";

const router = express.Router();

router.delete(
  "/delete/:id",
  [param("id").isString().notEmpty().escape().withMessage("id required")],
  async (req, res) => {
    const { id } = req.params;

    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json({ message: err.array() });
    }
    const user = await UserModel.findOne({
      id,
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    user.deleteOne({
      id,
    });

    res.status(200).json({
      message: "User deleted",
    });
  }
);

export default router;
