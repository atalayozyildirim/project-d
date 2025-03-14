import express from "express";
import * as tf from "@tensorflow/tfjs-node";
import Invoice from "../../db/Model/InvoiceModel.js";
import CustomerModel from "../../db/Model/CustomerModel.js";

const router = express.Router();

router.get("/monthly/sales/analyze", async (req, res) => {
  try {
    // Invoice modelinden tüm faturaları alıyoruz
    const invoices = await Invoice.find();

    // Aylık satış verilerini hesaplıyoruz
    const monthlySales = invoices.reduce((acc, invoice) => {
      const month = new Date(invoice.invoiceDate).getMonth(); // Fatura tarihinden ayı alıyoruz
      acc[month] = (acc[month] || 0) + invoice.total; // Her ay için toplam satışları hesaplıyoruz
      return acc;
    }, {});

    // Aylık satış verilerini TensorFlow.js ile kullanmak için hazırlıyoruz
    const months = Object.keys(monthlySales).map(Number); // Ayları sayısal değerlere çeviriyoruz
    const sales = Object.values(monthlySales); // Satışları alıyoruz

    // Verileri normalize ediyoruz
    const maxSales = Math.max(...sales);
    const normalizedSales = sales.map((sale) => sale / maxSales);

    // TensorFlow.js ile veri analizi ve model eğitimi yapıyoruz
    const inputTensor = tf.tensor2d(months, [months.length, 1]); // Ayları tensor formatına çeviriyoruz
    const outputTensor = tf.tensor2d(normalizedSales, [
      normalizedSales.length,
      1,
    ]); // Normalize edilmiş satışları tensor formatına çeviriyoruz

    // Modeli oluşturuyoruz
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 10, activation: "relu", inputShape: [1] }) // İlk katman: 10 nöronlu, ReLU aktivasyon fonksiyonlu
    );
    model.add(tf.layers.dense({ units: 1 })); // İkinci katman: 1 nöronlu

    // Modeli derliyoruz
    model.compile({ optimizer: "sgd", loss: "meanSquaredError" }); // Optimizasyon algoritması: Stokastik gradyan inişi, Kayıp fonksiyonu: Ortalama kare hatası

    // Modeli eğitiyoruz
    await model.fit(inputTensor, outputTensor, { epochs: 100 }); // Eğitim: 100 epoch

    // Tahmin yapıyoruz
    const nextMonth = months.length; // Bir sonraki ayı belirliyoruz
    const prediction = model
      .predict(tf.tensor2d([nextMonth], [1, 1])) // Bir sonraki ay için tahmin yapıyoruz
      .arraySync(); // Tahmin sonucunu array formatına çeviriyoruz

    // Tahmin edilen değeri denormalize ediyoruz
    const denormalizedPrediction = prediction[0][0] * maxSales;

    res
      .status(200)
      .json({
        nextMonth: nextMonth + 1,
        nextMontlySales: denormalizedPrediction,
      });
  } catch (error) {
    // Hata durumunda hata mesajını döndürüyoruz
    console.error("Error during analysis route:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/customer/analyze/totalSpent", async (req, res) => {
  try {
    const customers = await CustomerModel.find();

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

export default router;
