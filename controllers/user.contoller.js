const User = require("../models/user.model");

//* GET ALL USERS
const getUsers = async (req, res) => {
  const data = await User.find();
  res.json(data);
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

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(err);
  }
};

module.exports = { getUsers, createUser };
