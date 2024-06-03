const express = require("express");

const {
  getCategories,
  createCategory,
} = require("../controllers/category.controller");

const router = express.Router();

router.get("/", getCategories);

router.post("/", createCategory);

router.put("/:id", (req, res) => {
  //TODO:
});
router.delete("/:id", (req, res) => {
  //TODO:
});

module.exports = router;
