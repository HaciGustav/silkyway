const mongoose = require("mongoose");
const User = require("../models/user.model");
const Product = require("../models/product.model");


// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Current User
const getCurrentUser = async (req, res) => {
  try {
      const userId = req.user._id; 
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// Add Credits
const addCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const adminUser = req.user; 

    console.log('Admin user:', adminUser); // Debugging statement

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin rights required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.credits += parseInt(credits, 10); // Ensure credits are parsed as an integer
    await user.save();
    res.status(200).json({ message: "Credits added successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }};
  
  
  const purchaseProductWithCredits = async (req, res) => {
    const { userId, productIds } = req.body;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let totalCost = 0;
        const products = [];

        for (const productId of productIds) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productId} not found` });
            }
            if (product.stock < 1) {
                return res.status(400).json({ message: `Product ${product.name} is out of stock` });
            }
            totalCost += product.price;
            products.push(product);
        }

        if (user.credits < totalCost) {
            return res.status(400).json({ message: "Insufficient credits" });
        }

        user.credits -= totalCost;
        await user.save();

        for (const product of products) {
            product.stock -= 1;
            await product.save();
        }

        return res.status(200).json({ message: "Products purchased successfully", user });
    } catch (error) {
        console.error('Error during purchase:', error);
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
  getUsers,
  getCurrentUser,
  addCredits,
  purchaseProductWithCredits,
};
