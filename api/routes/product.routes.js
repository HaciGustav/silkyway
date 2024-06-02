const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
// TODO: change URL
router.get("/getProductsByFilter", getProductsByFilter);
router.post("/", createProduct);

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
