import express from "express";
import Personel from "../../db/Model/Personel.js";

const router = express.Router();

router.delete("/delete/:id", async (req, res) => {
  const exists = await Personel.findById(req.params.id);

  if (!exists) {
    return res.status(404).json({ message: "Personal not found" });
  }

  try {
    await Personel.findByIdAndDelete(req.params.id);
    res.json({ message: "Personal deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
