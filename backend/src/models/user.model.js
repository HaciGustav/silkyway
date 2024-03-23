const { Schema, model, Types } = require("mongoose");

const UserModel = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { collection: "users" }
);
module.exports = model("User", UserModel);
