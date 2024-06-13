const express = require("express");

const {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");
const { sendPurchaseMail } = require("../utils/email");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/getProductsByFilter", getProductsByFilter);
router.post("/", createProduct);
router.post("/email", (req, res) => {
  sendPurchaseMail();
  res.status(200).send("");
});

router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
