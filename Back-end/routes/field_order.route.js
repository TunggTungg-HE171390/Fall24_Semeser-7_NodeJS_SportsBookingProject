const bodyParser = require("body-parser");
const express = require("express");
const { Field_OrderController } = require("../controllers");

const authRouter = express.Router();
authRouter.use(bodyParser.json())

authRouter.get("/:id", Field_OrderController.getFieldOrdersByCustomerId);
authRouter.get("/getDetail/:id", Field_OrderController.getDetailByFieldOrdersId);

module.exports = authRouter;