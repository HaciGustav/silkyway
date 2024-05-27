const express = require("express");
const app = express();
const cors = require("cors");

const userRoute = require("./routes/user.routes");
const productsRoute = require("./routes/product.routes");
const { connectDB } = require("./config/db");

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/public/index.html");
});

app.use("/api/user", userRoute);
app.use("/api/products", productsRoute);

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/ `);
});

module.exports = app;
