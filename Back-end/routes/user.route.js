const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { UserController } = require("../controllers");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);

module.exports = router;
