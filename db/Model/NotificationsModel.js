import mongoose from "mongoose";

const Notifications = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notifications", Notifications);
