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
    const { userId, productIds } = req.body;
    console.log('Purchase request received:', { userId, productIds });

    const RETRY_LIMIT = 5;
    let retryCount = 0;

    while (retryCount < RETRY_LIMIT) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findById(userId).session(session);
            if (!user) {
                await session.abortTransaction();
                console.log('User not found');
                return res.status(404).json({ message: "User not found" });
            }

            let totalCost = 0;
            const products = [];

            const validProductIds = productIds.map(id => new mongoose.Types.ObjectId(id));

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
            return res.status(200).json({ message: "Products purchased successfully", user });
        } catch (error) {
            await session.abortTransaction();

            if (error.hasErrorLabel('TransientTransactionError')) {
                retryCount++;
                console.log(`TransientTransactionError encountered. Retry attempt ${retryCount}...`);
                continue;
            }

            console.error('Error during purchase:', error);
            return res.status(500).json({ message: error.message });
        } finally {
            session.endSession();
        }
    }

    console.log('Exceeded retry limit');
    return res.status(500).json({ message: "Exceeded retry limit" });
};
module.exports = {
  getUsers,
  addCredits,
  purchaseProductWithCredits,
};
