import express from "express";
import { analyzeData } from "../../lib/analyzeData.js";

const router = express.Router();

router.get("/analyze", async (req, res) => {
  try {
    const analysisResults = await analyzeData();
    res.status(200).json({ data: analysisResults });
  } catch (error) {
    console.error("Error during analysis route:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
