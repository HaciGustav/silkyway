const Category = require("../models/category.model");

//* GET ALL CATEGORIES
const getCategories = async (req, res) => {
  const data = await Category.find();
  res.json(data);
};

//*CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name }).exec();
    if (categoryExists) {
      res.status(400).send(`A Category with the name: ${name} already exists`);
      return;
    }
    const categories = await Category.find();

    const id = categories.reduce((acc, i) =>
      i.categoryID > acc.categoryID ? i : acc
    )?.categoryID;
    console.log(id);

    const newCategory = new Category({
      name,
      description,
      categoryID: id ? id + 1 : 1,
    });
    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getCategories, createCategory };
