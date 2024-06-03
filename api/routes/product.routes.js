const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/getProductsByFilter", getProductsByFilter);
router.post("/", createProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
