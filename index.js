import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import router from "./router/main.js";
import { connectDb } from "./db/ConnectDb.js";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import { redisConnect } from "./db/redis/redisConnect.js";
import { MyWebSocketInstance } from "./lib/websocket/webSocket.js";

dotenv.config();

const app = express();

if (process.env.REDIS_URI === undefined) {
  throw new Error("REDIS_URI is not defined");
}
const redisClient = createClient({
  host: process.env.REDIS_URI,
  port: process.env.REDIS_PORT,
});

const RedisStoreClient = new RedisStore({ client: redisClient });

app.set("trust proxy", 1);
app.use(
  session({
    store: RedisStoreClient,
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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "www.atalay.studio",
      "atalay.studio",
      "https://atalay.studio",
      "https://www.atalay.studio",
      "http://atalay.studio",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const server = app.listen(3000, async () => {
  try {
    console.log("Server is running on port 3000");

    // Connect to database
    await connectDb();
    // Conenct to Redis
    await redisConnect(redisClient);

    // Connect to WebSocket

    await MyWebSocketInstance.connect(server);
  } catch (error) {
    console.log("Error: ", error);
  }
});
