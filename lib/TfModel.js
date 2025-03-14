import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { fetchData, preprocessData } from "./AIAnlytcs.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 saniye zaman aşımı
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database:", error);
    throw error;
  }
};

const trainModel = async () => {
  try {
    await connectDb();

    const { customerData, taskData, invoiceData, personelData } =
      await fetchData();
    const customerProcessedData = preprocessData(customerData);
    const taskProcessedData = preprocessData(taskData);
    const invoiceProcessedData = preprocessData(invoiceData);
    const personelProcessedData = preprocessData(personelData);

    const data = [
      ...customerProcessedData,
      ...taskProcessedData,
      ...invoiceProcessedData,
      ...personelProcessedData,
    ];

    if (data.length === 0) {
      throw new Error("No data to train on");
    }

    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        units: 128,
        activation: "relu",
        inputShape: [data[0].input.length],
      })
    );
    model.add(tf.layers.dense({ units: 64, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });

    const inputs = data.map((item) => item.input);
    const outputs = data.map((item) => item.output);

    const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
    const ys = tf.tensor2d(outputs, [outputs.length, 1]);

    await model.fit(xs, ys, {
      epochs: 10,
      batchSize: 32,
    });

    const modelDir = path.resolve(__dirname, "../lib/aimodels");
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }

    const modelPath = path.join(modelDir, "model");
    if (fs.existsSync(modelPath)) {
      fs.rmSync(modelPath, { recursive: true, force: true });
    }

    await model.save(`file://${modelPath}`);
    console.log("Model trained and saved successfully");
  } catch (error) {
    console.error("Error training model:", error);
  } finally {
    mongoose.connection.close();
  }
};

export { trainModel };
