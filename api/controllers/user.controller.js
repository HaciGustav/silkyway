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
      const { userId, productIds } = req.body; // Expecting an array of product IDs
      const user = await User.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ message: "User not found" });
      }
  
      let totalCost = 0;
      const products = [];
  
      // Calculate total cost and check product availability
      for (const productId of productIds) {
        const product = await Product.findById(productId).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product with ID ${productId} not found` });
        }
        if (product.stock < 1) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Product ${product.name} is out of stock` });
        }
        totalCost += product.price;
        products.push(product);
      }
  
      if (user.credits < totalCost) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Insufficient credits" });
      }
  
      // Deduct credits and reduce product stock
      user.credits -= totalCost;
      for (const product of products) {
        product.stock -= 1;
        await product.save({ session });
      }
      await user.save({ session });
  
      await session.commitTransaction();
      res.status(200).json({ message: "Products purchased successfully", user });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: error.message });
    } finally {
      session.endSession();
    }
  };

module.exports = {
  getUsers,
  addCredits,
  purchaseProductWithCredits,
};
