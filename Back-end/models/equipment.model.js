const mongoose = require("mongoose");

const EquipmentsSchema = new mongoose.Schema({
  equipmentName: String,
  image: [
    {
      type: String,
      required: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
    enum: [0, 1],
  },
});

module.exports = mongoose.model("Equipments", EquipmentsSchema, "equipments");
