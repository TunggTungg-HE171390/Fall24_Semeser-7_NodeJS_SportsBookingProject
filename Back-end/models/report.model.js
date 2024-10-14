const mongoose = require("mongoose");

const ReportsSchema = new mongoose.Schema({
  title: String,
  description: String,
  reportTypeId: Number,
  status: Boolean,
  fieldOrderId: { type: mongoose.Types.ObjectId, ref: "FieldOrders" },
});

module.exports = mongoose.model("Reports", ReportsSchema, "reports");
