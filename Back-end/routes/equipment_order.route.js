const bodyParser = require("body-parser");
const express = require("express");
const { Equipment_OrderController } = require("../controllers");

const authRouter = express.Router();
authRouter.use(bodyParser.json())

authRouter.get("/:id", Equipment_OrderController.findEquipmentOrder);

module.exports = authRouter;