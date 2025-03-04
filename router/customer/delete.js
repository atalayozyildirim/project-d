import express from "express";
import CustomerModel from "../../db/Model/CustomerModel.js";
const router = express.Router();

router.delete("/delete/id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Id required !" });
  }

  const existCustomer = await CustomerModel.findById(id);

  if (!existCustomer) {
    return res.status(400).json({ error: "Customer not found !" });
  }

  await CustomerModel.deleteOne({ id });
});

export default router;
