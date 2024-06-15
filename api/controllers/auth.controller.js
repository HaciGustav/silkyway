const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//*CREATE USER
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

    const token = jwt.sign({ id: this.lastID }, "your_secret_key", {
      expiresIn: 100000000,
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
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
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  loginUser,
  createUser,
};
