const { Double } = require("mongodb");
const { Schema, model, Types } = require("mongoose");

const ProductModel = new Schema(
  {
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
    category: {
      type: Number,
    },

    stock: {
      type: Number,
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
  { collection: "product" }
);
module.exports = model("Product", ProductModel);
