const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { UserController } = require("../controllers");

<<<<<<< HEAD
router.get("/list", UserController.getAllUsers);
router.get("/userInfo/:id", UserController.getUserById);
router.post("/create", UserController.createUser);
router.post("/change-password/:id", UserController.changePassword);
router.post("/updateInfo/:id", UserController.updateUser);
router.post("/forgetPassword", UserController.forgotPassword);
=======
router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
<<<<<<< HEAD
=======
router.post("/login", UserController.login);
>>>>>>> bc268dc6956cf31aa4c74d71e2fef9d7aa993667
>>>>>>> main

module.exports = router;
