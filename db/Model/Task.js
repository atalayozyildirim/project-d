import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pendig", "completed", "in progress"],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
