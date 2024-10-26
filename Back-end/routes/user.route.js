const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { UserController } = require("../controllers");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
<<<<<<< HEAD
=======
router.post("/login", UserController.login);
>>>>>>> bc268dc6956cf31aa4c74d71e2fef9d7aa993667

module.exports = router;
