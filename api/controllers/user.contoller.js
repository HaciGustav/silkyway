const User = require("../models/user.model");
const Product = require("../models/product.model");
const express = require("express");
const router = express.Router();

const getUsers = async (req, res) => {
  try {
    // Logic to fetch users from database
    res.status(200).json({ users: [] }); // Example response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createUser = async (req, res) => {
  try {
    // Logic to create a new user in the database
    res.status(201).json({ message: "User created successfully" }); // Example response
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(200).json({ message: "Silky Dinar purchased successfully", user });
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
    
        const data = await Product.find({ _id: productID });
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    
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
  purchaseProductWithCredits,

};
