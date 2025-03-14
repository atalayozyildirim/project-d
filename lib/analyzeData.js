import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { fetchData, preprocessData } from "./AIAnlytcs.js";
import { trainModel } from "./TfModel.js";
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

const loadModel = async () => {
  try {
    const modelPath = path.resolve(
      __dirname,
      "../lib/aimodels/model/model.json"
    );
    console.log("Model path:", modelPath);

    if (!fs.existsSync(modelPath)) {
      console.log("Model file does not exist. Training a new model...");
      await trainModel();
    }

    const model = await tf.loadLayersModel(`file://${modelPath}`);
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

const analyzeData = async () => {
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
      throw new Error("No data to analyze");
    }

    const model = await loadModel();
    const inputTensor = tf.tensor2d(
      data.map((item) => item.input),
      [data.length, data[0].input.length]
    );
    const predictions = model.predict(inputTensor);
    const results = predictions.arraySync();
    console.log("Predictions:", results);
    return results;
  } catch (error) {
    console.error("Error during data analysis:", error);
    throw error;
  } finally {
    mongoose.connection.close();
  }
};

export { analyzeData };
