const { Schema, model, Types } = require("mongoose");

const ProductModel = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      // required: true,
    },
    categoryID: {
      type: Number,
    },

    stock: {
      type: Number,
    },
    tags: {
      type: Array,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  { collection: "products" }
);
module.exports = model("Product", ProductModel);
