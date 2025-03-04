import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import { connectDb } from "./db/ConnectDb.js";
import cookieParser from "cookie-parser";
import router from "./router/main.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      signed: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.listen(3000, async () => {
  try {
    console.log("Server is running on port 3000");

    // Connect to database
    await connectDb();
  } catch (error) {
    console.log("Error: ", error);
  }
});
