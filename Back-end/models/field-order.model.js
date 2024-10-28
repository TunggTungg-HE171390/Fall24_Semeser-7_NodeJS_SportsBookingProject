const mongoose = require("mongoose");

const FieldOrdersSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: [true, "Customer ID is required."],
  },
  fieldTime: [
    {
      fieldId: {
        type: mongoose.Types.ObjectId,
        ref: "Fields",
        required: [true, "Field ID is required."],
      },
      start: {
        type: Date,
        required: [true, "Start time is required."],
      },
      end: {
        type: Date,
        required: [true, "End time is required."],
      },
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
    required: [true, "Order date is required."],
  },
  status: {
    type: String,
    enum: {
      values: ["Completed", "Cancelled"],
      message: "Status must be either 'Completed' or 'Cancelled'.",
    },
    default: "Completed",
    required: [true, "Status is required."],
  },
  equipmentOrderId: {
    type: mongoose.Types.ObjectId,
    ref: "EquipmentOrders",
  },
});

module.exports = mongoose.model(
  "FieldOrders",
  FieldOrdersSchema,
  "field_orders"
);
