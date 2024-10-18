const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  account: {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  role: {
    type: Number,
    enum: [1, 2, 3],
    required: true,
  },
  profile: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^0\d{9}$/, "Phone number must start with 0 and have 10 digits"],
    },
    avatar: String,
  },
  status: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
});

module.exports = mongoose.model("Users", UsersSchema, "users");
