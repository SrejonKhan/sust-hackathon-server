const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required."],
    },
    email: {
      type: String,
      required: [true, "User email is required."],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User password is required."],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBan: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("users", userSchema);

module.exports = User;
