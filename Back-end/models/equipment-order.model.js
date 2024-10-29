const mongoose = require("mongoose");

const EquipmentOrderSchema = new mongoose.Schema({
  equipments: [
    {
      equipmentId: {
        type: mongoose.Types.ObjectId,
        ref: "Equipments", // Đúng với tên model "Equipments"
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("EquipmentOrders", EquipmentOrderSchema, "equipment_orders");
