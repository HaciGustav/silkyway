const Product = require("../models/product.model");
const Category = require("../models/category.model");

//* GET ALL PRODUCTS
const getProducts = async (req, res) => {
  const data = await Product.find();
  res.json(data);
};
const getProductsByCategory = async (req, res) => {
  const { categoryID } = req.body;
  if (categoryID) {
    const data = await Product.find({ category: categoryID });
    res.json(data);
  } else {
    res.status(400).send(`categoryID field is mandatory`);
  }
};

//*CREATE USER
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, categoryID } = req.body;

    const categoryExists = Category.findOne({ categoryID }).exec();

    const product = await Product.findOne({ name }).exec();
    if (product) {
      res
        .status(400)
        .send(`A Product with given name: ${name} is already exists`);
      return;
    } else if (!categoryExists) {
      res.status(400).send(`Given categoryID: ${name} does not exists`);
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      images,
      categoryID,
    });
    newProduct.id = newProduct._id;
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send(err);
  }
};
const buyProduct = async () => {};

module.exports = { getProducts, getProductsByCategory, createProduct };
