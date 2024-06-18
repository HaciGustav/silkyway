const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User
const createUser = async (req, res) => {
  try {
    const { email, password, firstname, lastname, address } = req.body;

    const user = await User.findOne({ email }).exec();
    if (user) {
      res.status(400).send("The email address is already in use");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      address,
    });
    newUser.id = newUser._id;
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "your_secret_key", {
      expiresIn: 100000000,
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Login User
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

    const token = jwt.sign({ id: user._id }, "your_secret_key", {
      expiresIn: 100000000,
    });
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
//MIDDELWARE 
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided'); // Debugging statement
    return res.sendStatus(401); // No token, unauthorized
  }

  try {
    console.log('Token:', token); // Debugging statement
    const decoded = jwt.verify(token, 'your_secret_key');
    console.log('Decoded token:', decoded); // Debugging statement
    req.user = await User.findById(decoded.id); // Attach user to request
    console.log('Authenticated user:', req.user); // Debugging statement
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message); // Debugging statement
    res.sendStatus(403); // Invalid token, forbidden
  }
};

module.exports = authenticateToken;


module.exports = {
  createUser,
  loginUser,
  authenticateToken,
};
