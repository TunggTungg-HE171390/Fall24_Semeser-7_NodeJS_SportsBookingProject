const mongoose = require("mongoose");
const equipment = require("./equipment.model");
const feedback = require("./feedback.model");
const field = require("./field.model");
const fieldOrder = require("./field-order.model");
const post = require("./post.model");
const report = require("./report.model");
const user = require("./user.model");
const equipmentOrder = require("./equipment-order.model");

const db = {};

db.equipment = equipment;
db.feedback = feedback;
db.field = field;
db.fieldOrder = fieldOrder;
db.post = post;
db.report = report;
db.user = user;
db.equipmentOrder = equipmentOrder;

db.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = db;
