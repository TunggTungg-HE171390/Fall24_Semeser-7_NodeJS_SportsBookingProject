const mongoose = require("mongoose");

const ReportsSchema = new mongoose.Schema({
  title: String,
  description: String,
  reportTypeId: Number,
  status: Boolean,
  field_order_id: { type: mongoose.Types.ObjectId, ref: "FieldOrders" },
});

module.exports = mongoose.model("Reports", ReportsSchema);
