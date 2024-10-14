const mongoose = require("mongoose");
const httpErrors = require("http-errors");

const User = require("./user.model");
const Field = require("./field.model");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "Title must not exceed 50 characters"],
    minLength: [5, "Title must be at least 5 characters"],
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: [500, "Description must not exceed 500 characters"],
    minLength: [10, "Description must be at least 10 characters"],
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
  location: {
    longitude: String,
    latitude: String,
    address: String,
  },
  status: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  fieldId: {
    type: mongoose.Types.ObjectId,
    ref: "Fields",
    required: true,
  },
});

// Kiểm tra người dùng và sân có tồn tại trong database không
PostSchema.pre("save", async function (next) {
  try {
    const userExists = await User.findById(this.ownerId);
    if (!userExists) {
      throw httpErrors.NotFound("User not found");
    }
    const fieldExists = await Field.findById(this.fieldId);
    if (!fieldExists) {
      throw httpErrors.NotFound("Field not found");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Posts", PostSchema, "posts");
