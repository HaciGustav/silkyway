const Product = require("../models/product.model");
const Category = require("../models/category.model");

//* GET ALL PRODUCTS or filtered products
const getProducts = async (req, res) => {
  const { priceRange, category, name } = req.query;

  if (!priceRange && !category && !name) {
    return res.status(400).json({ message: "At least one filter parameter must be provided" });
  }

  let filters = {};

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: "Invalid priceRange format. Expected format: minPrice-maxPrice" });
    }
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (category) {
    const categoryExists = await Category.findOne({ _id: category }).exec();
    if (!categoryExists) {
      return res.status(400).json({ message: `Category with ID ${category} does not exist` });
    }
    filters.category = category;
  }

  if (name) {
    filters.name = { $regex: name, $options: 'i' }; // Case insensitive regex search
  }

  try {
    const data = await Product.find(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* GET PRODUCTS BY CATEGORY
const getProductsByCategory = async (req, res) => {
  const { categoryID } = req.body;
  if (categoryID) {
    try {
      const data = await Product.find({ category: categoryID });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).send("categoryID field is mandatory");
  }
};

//* CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, categoryID } = req.body;

    // Check if required fields are present
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Product price is required" });
    }
    if (!images || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }
    if (!categoryID) {
      return res.status(400).json({ message: "categoryID is required" });
    }

    // Check if the category exists
    const categoryExists = await Category.findOne({ _id: categoryID }).exec();
    if (!categoryExists) {
      return res.status(400).json({ message: `Category with ID ${categoryID} does not exist` });
    }

    // Check if a product with the given name already exists
    const product = await Product.findOne({ name }).exec();
    if (product) {
      return res.status(400).json({ message: `A Product with the given name: ${name} already exists` });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      images,
      category: categoryID,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const buyProduct = async () => {};

module.exports = { getProducts, getProductsByCategory, createProduct, buyProduct };
