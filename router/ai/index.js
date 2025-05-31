import express from "express";
import * as tf from "@tensorflow/tfjs";
import Invoice from "../../db/Model/InvoiceModel.js";
import CustomerModel from "../../db/Model/CustomerModel.js";
import TaskModel from "../../db/Model/Task.js";

const router = express.Router();

router.get("/monthly/sales/analyze", async (req, res) => {
  try {
    const invoices = await Invoice.find();

    if (invoices.length === 0) {
      return res.status(404).json({ message: "No invoices found" });
    }

    // Aylık satış verilerini hazırla
    const monthlyData = new Array(12).fill(0);
    invoices.forEach((invoice) => {
      if (invoice.invoiceDate && typeof invoice.total === "number") {
        const month = new Date(invoice.invoiceDate).getMonth();
        monthlyData[month] += invoice.total;
      }
    });

    // Geçerli veri kontrolü
    const validMonths = monthlyData.filter((amount) => amount > 0);
    if (validMonths.length === 0) {
      return res.status(400).json({ message: "No valid sales data found" });
    }

    // Veriyi normalize et
    const maxSales = Math.max(...monthlyData);
    const normalizedData = monthlyData.map((sale) => sale / maxSales);

    try {
      // Model oluştur
      const model = tf.sequential();

      // Giriş katmanı
      model.add(
        tf.layers.dense({
          units: 8,
          activation: "relu",
          inputShape: [1],
        })
      );

      // Çıkış katmanı
      model.add(
        tf.layers.dense({
          units: 1,
        })
      );

      // Modeli derle
      model.compile({
        optimizer: "adam",
        loss: "meanSquaredError",
      });

      // Eğitim verilerini hazırla
      const xs = tf.tensor1d(Array.from({ length: 12 }, (_, i) => i));
      const ys = tf.tensor1d(normalizedData);

      // Modeli eğit
      await model.fit(xs, ys, {
        epochs: 100,
        verbose: 0,
      });

      // Tahmin yap
      const nextMonth = 12; // Bir sonraki ay
      const prediction = model.predict(tf.tensor1d([nextMonth]));
      const predictedValue = await prediction.data();
      const denormalizedPrediction = predictedValue[0] * maxSales;

      // Belleği temizle
      xs.dispose();
      ys.dispose();
      prediction.dispose();
      model.dispose();

      res.status(200).json({
        nextMonth: nextMonth + 1,
        nextMontlySales: denormalizedPrediction,
        confidence:
          1 -
          Math.abs(
            predictedValue[0] - normalizedData[normalizedData.length - 1]
          ),
      });
    } catch (tensorError) {
      console.error("TensorFlow error:", tensorError);
      return res.status(500).json({
        message: "Error during tensor operations",
        error: tensorError.message,
      });
    }
  } catch (error) {
    console.error("Error during analysis route:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/customer/analyze/totalSpent", async (req, res) => {
  try {
    const customers = await CustomerModel.find();

    if (customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }
    const customerTotalSpent = customers.map((customer) => {
      const totalSpent = customer.purchases.reduce((acc, purchase) => {
        return acc + purchase.total;
      }, 0);

      return { name: customer.name, totalSpent };
    });

    // Verileri normalize ediyoruz
    const maxTotalSpent = Math.max(
      ...customerTotalSpent.map((c) => c.totalSpent)
    );
    const normalizedTotalSpent = customerTotalSpent.map((c) => ({
      name: c.name,
      totalSpent: c.totalSpent / maxTotalSpent,
    }));

    const inputTensor = tf.tensor2d(
      normalizedTotalSpent.map((c) => c.totalSpent),
      [normalizedTotalSpent.length, 1]
    );

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 10, activation: "relu", inputShape: [1] })
    );
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

    await model.fit(inputTensor, inputTensor, { epochs: 100 });

    const predictions = model.predict(inputTensor).arraySync();

    // Tahmin edilen değerleri denormalize ediyoruz
    const denormalizedPredictions = predictions.map(
      (p) => p[0] * maxTotalSpent
    );

    const result = customerTotalSpent.map((customer, index) => ({
      name: customer.name,
      totalSpent: customer.totalSpent,
      predictedTotalSpent: denormalizedPredictions[index],
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error during analysis route:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.get("/task/recommendations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userTask = await TaskModel.find({ assignedTo: userId });

    if (!userTask || userTask.length === 0) {
      return res.status(400).json({ message: "No tasks found for this user" });
    }

    const taskDescription = userTask.map((task) => task.description);
    const taskStatus = userTask.map((task) => task.status);

    const inputTensor = tf.tensor2d(
      taskStatus.map((status) => {
        switch (status) {
          case "pending":
            return [1, 0, 0];
          case "in-progress":
            return [0, 1, 0];
          case "completed":
            return [0, 0, 1];
          default:
            return [0, 0, 0];
        }
      }),
      [taskStatus.length, 3]
    );

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 10, activation: "relu", inputShape: [3] })
    );
    model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

    await model.fit(inputTensor, inputTensor, { epochs: 100 });

    const recommendations = model.predict(inputTensor).arraySync();

    const recommendedTasks = recommendations.map((rec, index) => ({
      description: taskDescription[index],
      status:
        rec.indexOf(Math.max(...rec)) === 0
          ? "pending"
          : rec.indexOf(Math.max(...rec)) === 1
          ? "in-progress"
          : "completed",
    }));

    return res.status(200).json({ recommended: recommendedTasks });
  } catch (err) {
    console.error("Error during task recommendations:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
export default router;
