const mongoose = require("mongoose");

const EquipmentOrderSchema = new mongoose.Schema({
  equipments: [
    {
      equipment_id: {
        type: mongoose.Types.ObjectId,
        ref: "Equipments",
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

module.exports = mongoose.model("EquipmentOrders", EquipmentOrderSchema);
