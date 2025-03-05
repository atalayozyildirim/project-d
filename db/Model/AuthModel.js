import moongose from "mongoose";
import bcrypt from "bcrypt";

const AuthSchema = new moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  token: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
});
AuthSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
AuthSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

const AuthModel = moongose.model("Auth", AuthSchema);

export default AuthModel;
