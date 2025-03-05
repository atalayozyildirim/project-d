import mongoose from "mongoose";

const ImapEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  user: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  host: {
    type: String,
    required: true,
  },

  port: {
    type: Number,
    required: true,
  },
});

const ImapEmail = mongoose.model("ImapEmail", ImapEmailSchema);

export default ImapEmail;
