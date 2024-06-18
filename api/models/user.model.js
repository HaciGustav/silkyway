const { Schema, model, Types } = require("mongoose");

const UserModel = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
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
      minlength: 6,
    },
    address: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      default: 0,
    },
    isAdmin: { type: Boolean, default: true }
  },
  
  { collection: "users" }
);
module.exports = model("User", UserModel);
