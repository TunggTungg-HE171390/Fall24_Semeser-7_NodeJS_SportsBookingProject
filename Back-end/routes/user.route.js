const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { UserController } = require("../controllers");

router.get("/list", UserController.getAllUsers);
router.get("/list-from-admin", UserController.getAllUsersFromAdmin);
router.get("/userInfo/:id", UserController.getUserById);
router.post("/change-password/:id", UserController.changePassword);
router.post("/updateInfo/:id", UserController.updateUser);
router.put("/edit-user-from-admin", UserController.editUserFromAdmin);
router.post("/forgetPassword", UserController.forgotPassword);
router.put("/change-status", UserController.changeUserStatus);

module.exports = router;
