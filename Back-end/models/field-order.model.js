const mongoose = require("mongoose");

const FieldOrdersSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  fieldTime: [
    {
      fieldId: {
        type: mongoose.Types.ObjectId,
        ref: "Fields",
        required: true,
      },
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
  ],
  order_date: {
    type: Date,
  },
  status: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  equipmentOrderId: {
    type: mongoose.Types.ObjectId,
    ref: "EquipmentOrders",
  },
});

module.exports = mongoose.model("FieldOrders", FieldOrdersSchema);
