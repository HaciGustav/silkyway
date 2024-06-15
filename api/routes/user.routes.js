const express = require("express");
const { getUsers, createUser, addCredits, purchaseProductWithCredits } = require("../controllers/user.contoller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

router.put("/:id", (req, res) => {
  //TODO:
});
router.delete("/:id", (req, res) => {
  //TODO:
});
// Add credits to a user
router.post('/add-credits', addCredits);

// Purchase product with credits
router.post('/purchase-product', purchaseProductWithCredits);

module.exports = router;