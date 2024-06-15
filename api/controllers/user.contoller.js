const User = require("../models/user.model");
const Product = require("../models/product.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    // Logic to fetch users from database
    res.status(200).json({ users: [] }); // Example response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//*CREATE USER
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      res.status(400).send("The email address is already in use");
      return;
    }

    //const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ id: this.lastID }, "your_secret_key", {
      expiresIn: 100000000,
    });
    res.status(201).send(newUser, token);
  } catch (error) {
    res.status(500).send(err);
  }
};
//*LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send("Invalid password");
      return;
    }

    const token = jwt.sign({ id: this.lastID }, "your_secret_key", {
      expiresIn: 100000000,
    });
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Function to add credits to a user's account
const addCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.credits += credits;
    await user.save();
    res
      .status(200)
      .json({ message: "Silky Dinar purchased successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to purchase a product using credits
const purchaseProductWithCredits = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    const productID = req.body.productID;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (user.credits < product.price) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    user.credits -= product.price;
    await user.save();
    res.status(200).json({ message: "Product purchased successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  addCredits,
  loginUser,
  addCredits,
  purchaseProductWithCredits,
};
