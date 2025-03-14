import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthModel from "../../db/Model/AuthModel.js";
import CustomerModel from "../../db/Model/CustomerModel.js";
import InvoiceModel from "../../db/Model/InvoiceModel.js";
import ProductModel from "../../db/Model/ProductModel.js";
import TaskModel from "../../db/Model/Task.js";
import UserModel from "../../db/Model/UserModel.js";
import PersonelModel from "../../db/Model/Personel.js";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

const addTestData = async () => {
  try {
    // Clear existing data
    await AuthModel.deleteMany({});
    await CustomerModel.deleteMany({});
    await InvoiceModel.deleteMany({});
    await ProductModel.deleteMany({});
    await TaskModel.deleteMany({});
    await UserModel.deleteMany({});
    await PersonelModel.deleteMany({});

    // Add Auth data
    const authData = [
      { name: "John Doe", email: "john@example.com", password: "password123" },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
      },
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
      },
      { name: "Bob Brown", email: "bob@example.com", password: "password123" },
    ];
    await AuthModel.insertMany(authData);

    // Add Product data
    const productData = [
      { name: "Product 1", price: 50, stock: 100 },
      { name: "Product 2", price: 100, stock: 200 },
      { name: "Product 3", price: 150, stock: 300 },
      { name: "Product 4", price: 200, stock: 400 },
    ];
    const insertedProducts = await ProductModel.insertMany(productData);

    // Add Customer data
    const customerData = [
      {
        name: "Customer A",
        email: "customerA@example.com",
        company: "Company A",
        phone: "1234567890",
        address: "123 Street, City",
        purchases: [
          {
            productId: insertedProducts[0]._id,
            quantity: 2,
            total: 100,
            createdAt: new Date(),
          },
          {
            productId: insertedProducts[1]._id,
            quantity: 1,
            total: 100,
            createdAt: new Date(),
          },
        ],
      },
      {
        name: "Customer B",
        email: "customerB@example.com",
        company: "Company B",
        phone: "0987654321",
        address: "456 Avenue, City",
        purchases: [
          {
            productId: insertedProducts[0]._id,
            quantity: 1,
            total: 50,
            createdAt: new Date(),
          },
          {
            productId: insertedProducts[1]._id,
            quantity: 2,
            total: 200,
            createdAt: new Date(),
          },
        ],
      },
      {
        name: "Customer C",
        email: "customerC@example.com",
        company: "Company C",
        phone: "1122334455",
        address: "789 Boulevard, City",
        purchases: [
          {
            productId: insertedProducts[2]._id,
            quantity: 3,
            total: 450,
            createdAt: new Date(),
          },
          {
            productId: insertedProducts[3]._id,
            quantity: 1,
            total: 200,
            createdAt: new Date(),
          },
        ],
      },
      {
        name: "Customer D",
        email: "customerD@example.com",
        company: "Company D",
        phone: "6677889900",
        address: "101 Circle, City",
        purchases: [
          {
            productId: insertedProducts[2]._id,
            quantity: 2,
            total: 300,
            createdAt: new Date(),
          },
          {
            productId: insertedProducts[3]._id,
            quantity: 2,
            total: 400,
            createdAt: new Date(),
          },
        ],
      },
    ];
    const insertedCustomers = await CustomerModel.insertMany(customerData);

    // Update customerId in purchases
    for (const customer of insertedCustomers) {
      for (const purchase of customer.purchases) {
        purchase.customerId = customer._id;
      }
      await customer.save();
    }

    // Add Invoice data
    const invoiceData = [
      {
        invoiceNumber: "INV-001",
        invoiceDate: new Date(),
        customerName: "Customer A",
        customerAddress: "123 Street, City",
        items: [
          {
            productID: insertedProducts[0]._id,
            description: "Product 1",
            quantity: 2,
            price: 50,
          },
          {
            productID: insertedProducts[1]._id,
            description: "Product 2",
            quantity: 1,
            price: 100,
          },
        ],
        total: 200,
        status: "pending",
      },
      {
        invoiceNumber: "INV-002",
        invoiceDate: new Date(),
        customerName: "Customer B",
        customerAddress: "456 Avenue, City",
        items: [
          {
            productID: insertedProducts[0]._id,
            description: "Product 1",
            quantity: 1,
            price: 50,
          },
          {
            productID: insertedProducts[1]._id,
            description: "Product 2",
            quantity: 2,
            price: 100,
          },
        ],
        total: 250,
        status: "paid",
      },
      {
        invoiceNumber: "INV-003",
        invoiceDate: new Date(),
        customerName: "Customer C",
        customerAddress: "789 Boulevard, City",
        items: [
          {
            productID: insertedProducts[2]._id,
            description: "Product 3",
            quantity: 3,
            price: 150,
          },
          {
            productID: insertedProducts[3]._id,
            description: "Product 4",
            quantity: 1,
            price: 200,
          },
        ],
        total: 650,
        status: "pending",
      },
      {
        invoiceNumber: "INV-004",
        invoiceDate: new Date(),
        customerName: "Customer D",
        customerAddress: "101 Circle, City",
        items: [
          {
            productID: insertedProducts[2]._id,
            description: "Product 3",
            quantity: 2,
            price: 150,
          },
          {
            productID: insertedProducts[3]._id,
            description: "Product 4",
            quantity: 2,
            price: 200,
          },
        ],
        total: 700,
        status: "paid",
      },
    ];
    await InvoiceModel.insertMany(invoiceData);

    // Add Task data
    const taskData = [
      {
        title: "Task 1",
        description: "Description for Task 1",
        status: "pending",
        priority: "high",
        assignedTo: null,
        dueDate: new Date(),
      },
      {
        title: "Task 2",
        description: "Description for Task 2",
        status: "in progress",
        priority: "medium",
        assignedTo: null,
        dueDate: new Date(),
      },
      {
        title: "Task 3",
        description: "Description for Task 3",
        status: "completed",
        priority: "low",
        assignedTo: null,
        dueDate: new Date(),
      },
      {
        title: "Task 4",
        description: "Description for Task 4",
        status: "pending",
        priority: "high",
        assignedTo: null,
        dueDate: new Date(),
      },
    ];
    await TaskModel.insertMany(taskData);

    // Add User data
    const userData = [
      { userId: authData[0]._id, name: "John Doe", email: "john@example.com" },
      {
        userId: authData[1]._id,
        name: "Jane Smith",
        email: "jane@example.com",
      },
      {
        userId: authData[2]._id,
        name: "Alice Johnson",
        email: "alice@example.com",
      },
      { userId: authData[3]._id, name: "Bob Brown", email: "bob@example.com" },
    ];
    await UserModel.insertMany(userData);

    // Add Personel data
    const personelData = [
      {
        name: "Personel A",
        surname: "Surname A",
        email: "personelA@example.com",
        phone: "1234567890",
        salary: 5000,
      },
      {
        name: "Personel B",
        surname: "Surname B",
        email: "personelB@example.com",
        phone: "0987654321",
        salary: 6000,
      },
      {
        name: "Personel C",
        surname: "Surname C",
        email: "personelC@example.com",
        phone: "1122334455",
        salary: 7000,
      },
      {
        name: "Personel D",
        surname: "Surname D",
        email: "personelD@example.com",
        phone: "6677889900",
        salary: 8000,
      },
    ];
    await PersonelModel.insertMany(personelData);

    console.log("Test data added successfully");
  } catch (error) {
    console.log("Error adding test data: ", error);
  }
};

const run = async () => {
  await connectDb();
  await addTestData();
  mongoose.connection.close();
};

run();
