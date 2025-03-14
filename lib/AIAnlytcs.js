import mongoose from "mongoose";
import CustomerModel from "../db/Model/CustomerModel.js";
import Task from "../db/Model/Task.js";
import Invoice from "../db/Model/InvoiceModel.js";
import Personel from "../db/Model/Personel.js";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error connecting to database:", error);
    throw error;
  }
};

const fetchData = async () => {
  try {
    await connectDb();

    const customerData = await CustomerModel.find({});
    const taskData = await Task.find({});
    const invoiceData = await Invoice.find({});
    const personelData = await Personel.find({});

    if (
      !customerData.length &&
      !taskData.length &&
      !invoiceData.length &&
      !personelData.length
    ) {
      throw new Error("No data found in the database");
    }

    return {
      customer: customerData,
      task: taskData,
      invoice: invoiceData,
      personel: personelData,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    mongoose.connection.close();
  }
};

const preprocessData = (data) => {
  const processedData = data;

  console.log("Data preprocessed:", processedData);
  return processedData;
};
export { fetchData, preprocessData };
