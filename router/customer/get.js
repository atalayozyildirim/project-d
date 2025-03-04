import express from "express";
import CustomerModel from "../../db/Model/CustomerModel.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const users = await CustomerModel.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCustomer = await CustomerModel.countDocuments();
    const totalPages = Math.ceil(totalCustomer / limit);

    res.json({
      users,
      totalPages,
      currentPage: page,
      totalCustomer,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
export default router;
