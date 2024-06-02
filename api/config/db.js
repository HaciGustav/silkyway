const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

//import connection string
const connectString = process.env.CONNECT_STRING;

// create new MongoClient instance and export it

const options = {
  dbName: "silkyway", // Specify the database name here
};

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(connectString, options);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
