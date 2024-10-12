const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const userController = require("../controllers/user.controller");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
