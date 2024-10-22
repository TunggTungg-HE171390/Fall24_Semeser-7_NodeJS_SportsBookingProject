const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { FieldController } = require("../controllers");

router.get("/", FieldController.getAllFields);
router.post("/", FieldController.createField);

module.exports = router;
