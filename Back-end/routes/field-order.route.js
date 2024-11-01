const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
router.use(bodyParser.json());

const { FieldOrderController } = require("../controllers");

// Get all field orders
router.get("/", FieldOrderController.getAllFieldOrders);

// Get field order by ID
router.get("/:id", FieldOrderController.getFieldOrderById);

// Create a new field order
router.post("/", FieldOrderController.createFieldOrder);

//get detail field order
router.get("/detail/:id", FieldOrderController.getDetailByFieldOrdersId);

// Update an existing field order by ID
router.put("/:id", FieldOrderController.updateFieldOrder);

// Delete a field order by ID
router.delete("/:id", FieldOrderController.deleteFieldOrder);

// Check available slots for a specific field on a given date
router.get(
  "/fields/:fieldId/available-slots",
  FieldOrderController.getAvailableSlotsForField
);

// Get field orders by customer ID
router.get(
  "/customer/:customerId",
  FieldOrderController.getFieldOrdersByCustomerId
);

module.exports = router;
