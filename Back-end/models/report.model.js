const mongoose = require("mongoose");

const ReportsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  reportTypeId: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  status: { type: Number, required: true, default: 1, enum: [1, 2, 3, 4, 5] },
  fieldOrderId: { type: mongoose.Types.ObjectId, ref: "FieldOrders" },
});

module.exports = mongoose.model("Reports", ReportsSchema, "reports");
