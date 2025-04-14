import express from "express";
import UserModel from "../../db/Model/UserModel.js";
import { createClient } from "redis";

const router = express.Router();

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,

  socket: {
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT,
  },
})
redisClient.connect().catch((e) => console.log("Redis connection failed"));

router.get("/me", async (req, res) => {
  console.log(req.currentUser);
  try {
    const cachedUser = await redisClient.get(
      `session:${req.currentUser.user.id}`
    );
    if (cachedUser) {
      return res.status(200).json({ data: JSON.parse(cachedUser) });
    }
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
