const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { UserController, FieldOrderController } = require("../controllers");

router.get("/list", UserController.getAllUsers);
router.get("/userInfo/:id", UserController.getUserById);
router.post("/create", UserController.createUser);
router.post("/change-password/:id", UserController.changePassword);
router.post("/updateInfo/:id", UserController.updateUser);
router.post("/forgetPassword", UserController.forgotPassword);

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);

router.post("/login", UserController.login);

router.get("/:id", FieldOrderController.getFieldOrdersByCustomerId);
router.get("/getDetail/:id", FieldOrderController.getDetailByFieldOrdersId);

module.exports = router;
