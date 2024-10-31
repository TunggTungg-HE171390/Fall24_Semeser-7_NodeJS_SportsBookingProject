const mongoose = require("mongoose");

const FieldOrdersSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: [true, "Customer ID is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
  },
  fieldId: {
    type: mongoose.Types.ObjectId,
    ref: "Fields",
    required: [true, "Field ID is required."],
  },
  subFieldId: {
    type: mongoose.Types.ObjectId,
    required: [true, "SubField ID is required."],
  },
  slotId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Slot ID is required."],
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: [true, "Order date is required."],
  },
  status: {
    type: String,
    enum: {
      values: ["Completed", "Cancelled", "Pending"],
      message: "Status must be either 'Completed', 'Cancelled', or 'Pending'.",
    },
    default: "Pending",
    required: [true, "Status is required."],
  },
  equipmentOrderId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "EquipmentOrders",
    },
  ],
});

module.exports = mongoose.model(
  "FieldOrders",
  FieldOrdersSchema,
  "field_orders"
);
