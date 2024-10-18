const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const fieldController = require("../controllers/field.controller");

router.get("/", fieldController.getAllFields);
router.post("/", fieldController.createField);

module.exports = router;
