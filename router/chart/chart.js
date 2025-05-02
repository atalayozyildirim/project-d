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
    const currentYear = new Date().getFullYear();

    const salesTotal = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: {
            $gte: new Date(`${currentYear}`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$invoiceDate" } }, // Ay bazında gruplama
          totalSales: { $sum: "$total" },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    const monthSales = Array(12).fill(0);
    salesTotal.forEach((sale) => {
      monthSales[sale._id.month - 1] = sale.totalSales;
    });

    return res.status(200).json(monthSales);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/monthGain", async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    const employerSalary = await Employer.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);

    const salesTotal = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$invoiceDate" } },
          totalSales: { $sum: "$total" },
        },
      },
    ]);

    if (salesTotal.length === 0 || employerSalary.length === 0) {
      return res.status(200).json({
        gain: salesTotal[0]?.totalSales || 0,
        expense: employerSalary[0]?.totalSalary || 0,
      });
    }

    console.log("salesTotal", salesTotal);
    console.log("employerSalary", employerSalary);
    return res.status(200).json({
      gain: salesTotal[0].totalSales,
      expense: employerSalary[0].totalSalary,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/monthSalesRevenue", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: {
            $gte: new Date(`${currentYear}`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$invoiceDate" } },
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);
    if (monthlyRevenue.length > 0) {
      const monthRevenue = Array(12).fill(0);

      monthlyRevenue.forEach((revenue) => {
        monthRevenue[revenue._id.month - 1] = revenue.totalRevenue;
      });

      return res.status(200).json(monthRevenue);
    } else {
      return res.status(200).json([]);
    }
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/newCustomersByMonth", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const newCustomers = await Customer.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}`),
            $lte: new Date(`${currentYear + 1}`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
    ]);
    if (newCustomers.length > 0) {
      const monthCustomers = Array(12).fill(0);

      newCustomers.forEach((customer) => {
        monthCustomers[customer._id.month - 1] = customer.total;
      });
      return res.status(200).json(monthCustomers);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error });
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
