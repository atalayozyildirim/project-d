import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

router.post("/verify", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    console.log("Token is required");
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return res.status(200).json({ message: "Token is valid", decoded });
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid", error });
  }
});

export default router;
