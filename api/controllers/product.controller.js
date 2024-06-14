const Product = require("../models/product.model");
const Category = require("../models/category.model");

//* GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductById = async (req, res) => {
  const productID = req.params.id;
  console.log("PARAMS===>", productID);
  try {
    const data = await Product.find({ _id: productID });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//* GET filtered products
const getProductsByFilter = async (req, res) => {
  const { priceRange, categoryID, name, tag, id } = req.query;

  if (!priceRange && !categoryID && !name && !tag && !id) {
    return res
      .status(400)
      .json({ message: "At least one filter parameter must be provided" });
  }

  let filters = {};

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({
        message:
          "Invalid priceRange format. Expected format: minPrice-maxPrice",
      });
    }
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (categoryID) {
    const categoryExists = await Category.findOne({ categoryID }).exec();
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `Category with ID ${categoryID} does not exist` });
    }
    filters.categoryID = categoryID;
  }

  if (name) {
    filters.name = { $regex: name, $options: "i" }; // Case insensitive regex search
  }
  if (id) {
    filters.id = id;
  }

  if (tag) {
    filters.tags = { $in: [tag] };
  }

  try {
    const data = await Product.find(filters);
    res.json(data);
  } catch (error) {
    console.log(error);
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
    const { name, description, price, stock, images, categoryID, tags } =
      req.body;

    // Check if a product with the given name already exists
    // Check if required fields are present
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Product price is required" });
    }
    if (!images || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    if (!categoryID) {
      return res.status(400).json({ message: "categoryID is required" });
    }

    // Check if the category exists
    const categoryExists = await Category.findOne({
      categoryID: categoryID,
    }).exec();
    if (!categoryExists) {
      return res
        .status(400)
        .json({ message: `Category with ID ${categoryID} does not exist` });
    }

    // Check if a product with the given name already exists
    const product = await Product.findOne({ name }).exec();
    if (product) {
      return res.status(400).json({
        message: `A Product with the given name: ${name} already exists`,
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      description,
      tags,
      price,
      stock,
      images,
      categoryID: categoryID,
    });
    newProduct.id = newProduct._id;
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//* UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, images, categoryID } = req.body;

    // Check for missing fields
    if (!name || !description || !price || !stock || !images || !categoryID) {
      return res.status(400).send("All fields are required");
    }

    // Check if the product exists
    const product = await Product.findById(id).exec();
    if (!product) {
      return res.status(404).send("Product not found with the given ID");
    }

    // Check if the category exists
    const categoryExists = await Category.find({ categoryID }).exec();
    if (!categoryExists) {
      return res.status(400).send("Given categoryID does not exist");
    }

    // Update the product
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.images = images;
    product.categoryID = categoryID;

    await product.save();
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the product");
  }
};

//* DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Check if the product ID is provided
    if (!id) {
      return res.status(400).send("Product ID is required");
    }

    // Check if the product exists
    const product = await Product.findById(id).exec();
    if (!product) {
      return res.status(404).send("Product not found with the given ID");
    }

    // Delete the product
    await product.deleteOne();
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the product");
  }
};

const buyProduct = async (req, res) => {
  //TODO: Implement a function that checks if the product.stock >= 1
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
