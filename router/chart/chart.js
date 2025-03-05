import express from "express";
import Invoice from "../../db/Model/InvoiceModel.js";
import Customer from "../../db/Model/CustomerModel.js";
import Employer from "../../db/Model/Personel.js";

const router = express.Router();

router.get("/total", async (req, res) => {
  const totalInvoices = await Invoice.find().countDocuments();
  const totalCustomers = await Customer.find().countDocuments();
  const totalEmployers = await Employer.find().countDocuments();
  res.json({ totalInvoices, totalCustomers, totalEmployers });
});

router.get("/totalInvoices", async (req, res) => {
  try {
    const total = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    if (total.length > 0) {
      return res.status(200).json({ totalAmount: total[0].totalAmount });
    } else {
      return res.status(200).json({ totalAmount: 0 });
    }
  } catch {}
});

router.get("/totalInvoicesByMonth", async (req, res) => {
  try {
    const total = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    if (total.length > 0) {
      return res.status(200).json(total);
    } else {
      return res.status(200).json([]);
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/total/sales", async (req, res) => {
  try {
    const salesTotal = await Employer.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    if (salesTotal.length > 0) {
      return res.status(200).json({ totalSalary: salesTotal[0].totalSalary });
    } else {
      return res.status(200).json({ totalSalary: 0 });
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/monthSalesRevenue", async (req, res) => {
  try {
    const monthlyRevenue = await Invoice.aggregate([
      {
        $group: {
          _id: { $month: "$invoiceDate" },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    if (monthlyRevenue.length > 0) {
      return res.status(200).json(monthlyRevenue);
    } else {
      return res.status(200).json([]);
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/newCustomersByMonth", async (req, res) => {
  try {
    const newCustomers = await Customer.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
    ]);
    if (newCustomers.length > 0) {
      return res.status(200).json(newCustomers);
    } else {
      return res.status(200).json([]);
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/topSellingProducts", async (req, res) => {
  try {
    const topProducts = await Invoice.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.description",
          total: { $sum: "$items.quantity" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      { $limit: 10 },
    ]);
    if (topProducts.length > 0) {
      return res.status(200).json(topProducts);
    } else {
      return res.status(200).json([]);
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});
export default router;
