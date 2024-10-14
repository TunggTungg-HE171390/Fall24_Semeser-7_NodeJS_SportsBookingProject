const mongoose = require("mongoose");

const FieldsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "Field name must not exceed 50 characters"],
    minLength: [5, "Field name must be at least 5 characters"],
  },
  sportName: {
    type: String,
    enum: ["Football", "Volleyball", "Badminton", "Tennis", "Table Tennis"],
    required: true,
  },
  location: {
    longitude: String,
    latitude: String,
    address: String,
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  feedBackId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Feedbacks",
    },
  ],
  fieldTime: [
    {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5],
      },
    },
  ],
  image: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
});

module.exports = mongoose.model("Fields", FieldsSchema, "fields");
