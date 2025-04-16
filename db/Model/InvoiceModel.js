import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  items: {
    type: [
      {
        productID: {
          type: Number,
          required: true,
        },
        description: String,
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;
