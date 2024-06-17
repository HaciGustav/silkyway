const User = require("../models/user.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Credits
const addCredits = async (req, res) => {
  try {
    const { userId, credits } = req.body;
    const adminUser = req.user; // Assuming `req.user` contains the current logged-in user

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, productIds } = req.body;
        console.log('Received purchase request:', { userId, productIds });

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        let totalCost = 0;
        const products = [];

        // Validate and convert product IDs
        const validProductIds = productIds.map(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid product ID: ${id}`);
            }
            return new mongoose.Types.new.ObjectId(id); // Use 'new' here
        });

        for (const productId of validProductIds) {
            const product = await Product.findById(productId).session(session);
            if (!product) {
                await session.abortTransaction();
                console.log(`Product with ID ${productId} not found`);
                return res.status(404).json({ message: `Product with ID ${productId} not found` });
            }
            if (product.stock < 1) {
                await session.abortTransaction();
                console.log(`Product ${product.name} is out of stock`);
                return res.status(400).json({ message: `Product ${product.name} is out of stock` });
            }
            totalCost += product.price;
            products.push(product);
        }

        if (user.credits < totalCost) {
            await session.abortTransaction();
            console.log('Insufficient credits');
            return res.status(400).json({ message: "Insufficient credits" });
        }

        user.credits -= totalCost;
        for (const product of products) {
            product.stock -= 1;
            await product.save({ session });
        }
        await user.save({ session });

        await session.commitTransaction();
        console.log('Purchase successful');
        res.status(200).json({ message: "Products purchased successfully", user });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error during purchase:', error);
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
//* ADD PRODUCT TO CART
const addProductToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid User ID or Product ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    user.cart.push(productId);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getUsers,
  addCredits,
  purchaseProductWithCredits,
  addProductToCart,
};
