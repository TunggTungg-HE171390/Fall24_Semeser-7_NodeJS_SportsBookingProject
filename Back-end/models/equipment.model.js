const mongoose = require("mongoose");

const EquipmentsSchema = new mongoose.Schema({
  equipment_name: String,
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
    enum: [1, 2, 3, 4, 5],
  },
});

module.exports = mongoose.model("Equipments", EquipmentsSchema);
