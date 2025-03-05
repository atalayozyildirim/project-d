import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
