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

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, "your_secret_key", {
      expiresIn: 100000000,
    });

    res
      .status(201)
      .cookie("token", token, { httpOnly: true, secure: true }) // Set token in cookie
      .json({ user: newUser });
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

    const token = jwt.sign({ id: user.id, email: user.email }, "your_secret_key", {
      expiresIn: 100000000,
    });

    res
      .status(200)
      .cookie("token", token, { httpOnly: true, secure: true }) // Set token in cookie
      .send({ user });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Middleware to authenticate JWT from cookies
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.clearCookie("token").send("Logged out successfully");
};

module.exports = {
  loginUser,
  createUser,
  authenticateJWT,
  logoutUser,
};
