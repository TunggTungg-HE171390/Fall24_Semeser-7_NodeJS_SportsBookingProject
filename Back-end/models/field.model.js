const mongoose = require("mongoose");

const FieldsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, "Field name must not exceed 100 characters"],
    minLength: [3, "Field name must be at least 3 characters"],
  },
  sportName: {
    type: String,
    enum: ["Football", "Volleyball", "Badminton", "Tennis", "Table Tennis"],
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, "Address must not exceed 100 characters"],
    minLength: [3, "Address must be at least 3 characters"],
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
  totalFields: {
    type: Number,
    required: true,
    min: [1, "There must be at least 1 field"],
  },
  price: {
    type: Number,
    required: true,
  },
  subFields: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxLength: [100, "Sub field name must not exceed 100 characters"],
        minLength: [3, "Sub field name must be at least 3 characters"],
      },
      fieldTime: [
        {
          start: {
            type: String,
            required: true,
          },
          end: {
            type: String,
            required: true,
          },
          status: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4, 5],
          },
        },
      ],
    },
  ],
  image: [
    {
      type: String,
      required: true,
    },
  ],
  status: {
    type: String,
    default: "ACTIVE",
    enum: ["ACTIVE", "INACTIVE"],
    required: true,
  },
});

module.exports = mongoose.model("Fields", FieldsSchema, "fields");
