const express = require("express");
const app = express();
const cors = require("cors");

const router = express.Router();

// SWAGGER IMPORTS
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");

const { connectDB } = require("./api/config/db");
const { createUser, loginUser, authenticateToken } = require("./api/controllers/auth.controller");
const {
  getCategories,
  createCategory,
} = require("./api/controllers/category.controller");
const {
  getAllProducts,
  getProductsByFilter,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./api/controllers/product.controller");
const { sendPurchaseMail } = require("./api/utils/email");
const {
  getUsers,
  addCredits,
  purchaseProductWithCredits,
  addProductToCart,
} = require("./api/controllers/user.controller");


app.use(express.json());
app.use(cors());
app.use(express.static("./public"));
app.use("*.css", (req, res, next) => {
  res.set("Content-Type", "text/css");
  next();
});
app.use("api/users/purchaseProductWithCredits", authenticateToken);
app.use("/api/users/add-credits", authenticateToken);
//app.use("/api/users", addProductToCart);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const options = {
  customCssUrl: "/styles/swagger-ui.css",
};

//SWAGGER
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc, options));

//
//
//
//*AUTH
router.post("/auth/register", createUser);
router.post("/auth/login", loginUser);

//
//
//
//*USER
router.get("/users", getUsers);
router.post("/users/:userId/cart/:productId", authenticateToken, addProductToCart);

router.put("/users/:id", (req, res) => {
  //TODO:
});
router.delete("/users/:id", (req, res) => {
  //TODO:
});
// Add credits to a user
router.post("/users/add-credits", authenticateToken, addCredits);
///router.post("/make-admin", authenticateJWT, makeAdmin); 
// BUY SOMETHING
router.post("/users/purchase-product", authenticateToken, purchaseProductWithCredits);
//
//
//*PRODUCT
router.get("/products", getAllProducts);
router.get("/products/getProductsByFilter", getProductsByFilter);


router.post("/products", createProduct);
router.post("/products/email", (req, res) => {
  sendPurchaseMail();
  res.status(200).send("");
});

router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

//
//
//
//*CATEGORIES
router.get("/categories", getCategories);

router.post("/categories", createCategory);

router.put("/categories/:id", (req, res) => {
  //TODO:
});
router.delete("/categories/:id", (req, res) => {
  //TODO:
});

app.use("/api", router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/ `);
});

module.exports = app;
