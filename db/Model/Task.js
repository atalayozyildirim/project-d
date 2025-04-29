import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return `TASK-${Math.floor(Math.random() * 10000)}`;
    },
    validate: {
      validator: function (v) {
        return /^TASK-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid task ID! It should start with 'TASK-' followed by digits.`,
    },
  },
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
    enum: ["pending", "completed", "in progress"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dueDate: {
    type: Date,
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
