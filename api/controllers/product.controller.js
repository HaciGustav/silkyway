const Product = require("../models/product.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");
//* GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* GET FILTERED PRODUCTS
const getProductsByFilter = async (req, res) => {
  const { priceRange, categoryID, name, tag, id } = req.query;

  if (!priceRange && !categoryID && !name && !tag && !id) {
    return res.status(400).json({ message: "At least one filter parameter must be provided" });
  }

  let filters = {};

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: "Invalid priceRange format. Expected format: minPrice-maxPrice" });
    }
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (categoryID) {
    const categoryExists = await Category.exists({ _id: categoryID });
    if (!categoryExists) {
      return res.status(400).json({ message: `Category with ID ${categoryID} does not exist` });
    }
    filters.categoryID = categoryID;
  }

  if (name) {
    filters.name = { $regex: name, $options: "i" };
  }

  if (id) {
    filters._id = id;
  }

  if (tag) {
    filters.tags = { $in: [tag] };
  }

  try {
    const products = await Product.find(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, categoryID, tags } = req.body;

    if (!name || !description || !price || !images || images.length === 0) {
      return res.status(400).json({ message: "Name, description, price, and at least one image are required" });
    }

    const productExists = await Product.exists({ name });
    if (productExists) {
      return res.status(400).json({ message: `Product with name ${name} already exists` });
    }

    const newProduct = new Product({
      id: new mongoose.Types.ObjectId(),
      name,
      description,
      price,
      stock: stock || 0, // Default stock to 0 if not provided
      images,
      categoryID: categoryID || null, // Default categoryID to null if not provided
      tags: tags || [],
      created_at: new Date(),
      updated_at: new Date()
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//* UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    Object.assign(product, { name, price, stock });
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//* BUY PRODUCT
const buyProduct = async (req, res) => {
//I have in user this 
};
module.exports = {
  getAllProducts,
  getProductsByFilter,
  // getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  buyProduct,
};
