import express from "express";
import EmployersModel from "../../db/Model/Personel.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await EmployersModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await EmployersModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      totalPages,
      currentPage: page,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
