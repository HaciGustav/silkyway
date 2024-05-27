const Category = require("../models/category.model");

//* GET ALL USERS
const getCategories = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

//*CREATE Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name }).exec();
    if (!categoryExists) {
      res.status(400).send(`A Category with the name: ${name} already exists`);
      return;
    }
    const categories = await Category.find();

    const newCategory = new Category({
      name,
      description,
      categoryID: categories.length + 1,
    });

    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send(err);
  }
};

module.exports = { getCategories, createCategory };
