const fieldModel = require("../models/field.model");

const getAllFields = async (req, res) => {
  try {
    const fields = await fieldModel.find();
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createField = async (req, res) => {
  try {
    const field = await fieldModel.create(req.body);
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFields,
  createField,
};
