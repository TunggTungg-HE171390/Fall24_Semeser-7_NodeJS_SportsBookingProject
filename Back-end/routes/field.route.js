const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { FieldController } = require("../controllers");

router.get("/", FieldController.getFields);
router.post("/", FieldController.addField);
router.put("/:id", FieldController.updateField);
router.delete("/:id", FieldController.deleteField);
router.get("/:id", FieldController.getFieldById);

module.exports = router;
