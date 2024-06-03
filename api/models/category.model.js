const { Schema, model, Types } = require("mongoose");

const CategoryModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    categoryID: {
      type: Number,
      required: true,
    },

    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  { collection: "categories" }
);
module.exports = model("Category", CategoryModel);
