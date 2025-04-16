import { Server } from "socket.io";
import jwt from "jsonwebtoken";
export class MyWebSocket {
  #io;
  #userSockets = new Map();

  get io() {
    if (!this.#io) {
      throw new Error("Socket.io not initialized");
    }
    return this.#io;
  }

  async connect(server) {
    this.#io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.#io.on("connection", (socket) => {
      socket.on("register", (token) => {
        if (!token) {
          console.error("User ID is required");
          return;
        }

        let decoded;
        let userId;
        try {
          decoded = jwt.verify(token, process.env.SECRET_KEY);
          userId = decoded?.user?.id;
          if (!userId) {
            console.error("User ID not found in token");
            return;
          }
        } catch (err) {
          console.error("Invalid token", err.message);
          return;
        }
        this.#userSockets.set(userId, socket.id);
        console.log("User registered with id: ", userId);
      });

      socket.on("disconnect", () => {
        for (const [key, value] of this.#userSockets.entries()) {
          if (value === socket.id) {
            this.#userSockets.delete(key);
            break;
          }
        }
      });
    });
  }

  async disconnect() {
    if (this.#io) {
      this.#io.close();
    }
  }

  sendNotification(notification, userId) {
    const socketId = this.#userSockets.get(userId);
    if (socketId) {
      this.#io.to(socketId).emit("notification", notification);
    }
  }
}

const MyWebSocketInstance = new MyWebSocket();
export { MyWebSocketInstance };
