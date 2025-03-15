import { Server } from "socket.io";
import eiows from "eiows";
import Task from "../../db/Model/Task.js";
import { verifyJWT } from "../../util/generateJWT.js";

const connectWebSocket = (server) => {
  // WEBSOCKET
  const io = new Server(server, {
    wsEngine: eiows.Server,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to websocket", socket.id);

    try {
      socket.on("TaskUpdate", async (data) => {
        const task = await Task.findById(data.taskId);

        if (task) {
          task.status = data.status;
          await task.save();
          io.emit("TaskUpdate", task);
        }
      });

      socket.on("TaskComment", async (data) => {
        const task = await Task.findById(data.taskId);

        if (!task) {
          return io.emit("TaskComment", "Task not found");
        }

        task.comments.push({
          user: data.user,
          comment: data.comment,
        });

        await task.save();
        io.emit("TaskComment", task);
      });

      socket.on("TaskAssing", async (data) => {
        const task = await Task.findById(data.taskId);

        if (!task) {
          return io.emit("TaskAssing", "Task not found");
        }

        task.assignedTo = data.assignedTo;
        await task.save();
        io.emit("TaskAssing", task);
      });
    } catch (error) {
      console.log("Error procsessing task update: ", error);
      io.emit("TaskUpdate", "Error updating task status");
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from websocket", socket.id);
    });
  });
};

export { connectWebSocket };
