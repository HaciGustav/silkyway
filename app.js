const express = require("express");
const app = express();
const cors = require("cors");
// SWAGGER
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

const userRoute = require("./api/routes/user.routes");
const productRoute = require("./api/routes/product.routes");
const categoryRoute = require("./api/routes/category.routes");
const { connectDB } = require("./api/config/db");

app.use(express.json());
app.use(cors());
app.use(express.static("./public"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/ `);
});

module.exports = app;
