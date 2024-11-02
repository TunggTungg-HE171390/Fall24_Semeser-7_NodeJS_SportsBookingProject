const mongoose = require("mongoose");

const EquipmentOrderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, "Address must not exceed 100 characters"],
      minLength: [3, "Address must be at least 3 characters"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^0\d{9}$/, "Phone number must start with 0 and have 10 digits"],
    },
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
          min: [0, "Price must be a positive number"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate totalPrice before saving
EquipmentOrderSchema.pre("save", function (next) {
  this.totalPrice = this.equipments.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

module.exports = mongoose.model(
  "EquipmentOrders",
  EquipmentOrderSchema,
  "equipment_orders"
);
