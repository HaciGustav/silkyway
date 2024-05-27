const express = require("express");

const {
  createProduct,
  getProducts,
  getProductsByCategory,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);
// TODO: change URL
router.get("/", getProductsByCategory);
router.post("/", createProduct);

router.put("/:id", (req, res) => {
  //TODO:
});
router.delete("/:id", (req, res) => {
  //TODO:
});

module.exports = router;
