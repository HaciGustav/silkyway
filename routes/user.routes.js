const express = require("express");
const { getUsers, createUser } = require("../controllers/user.contoller");

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

router.put("/:id", (req, res) => {
  //TODO:
});
router.delete("/:id", (req, res) => {
  //TODO:
});

module.exports = router;
