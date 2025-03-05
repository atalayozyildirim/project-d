import express from "express";
import UserModel from "../../db/Model/UserModel.js";
const router = express.Router();

router.get("/me", async (req, res) => {
  console.log(req.currentUser);
  try {
    const user = await UserModel.find({ userId: req.currentUser.user.id });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ data: user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
