const mongoose = require("mongoose");

const EquipmentsSchema = new mongoose.Schema({
  equipmentName: String,
  image: [
    {
      type: String,
      required: true,
    },
  ],
  sportName: {
    type: String,
    enum: {
      values: ["Football", "Volleyball", "Badminton", "Tennis", "Table Tennis"],
      message:
        "{VALUE} is not a valid sport name. Please select from Football, Volleyball, Badminton, Tennis, or Table Tennis.",
    },
    required: [true, "The sport name is required"],
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
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
  status: {
    type: Number,
    required: true,
    default: 1,
    enum: [0, 1],
  },
});

module.exports = mongoose.model("Equipments", EquipmentsSchema, "equipments");
