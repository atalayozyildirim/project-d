import mongoose from "mongoose";

const MailDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  from: {
    type: String,
    required: true,
  },
});

const MailData = mongoose.model("MailData", MailDataSchema);

export default MailData;
