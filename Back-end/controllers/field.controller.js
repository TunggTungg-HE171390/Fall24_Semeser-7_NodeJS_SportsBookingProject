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

const updateField = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const updatedField = await fieldModel.findByIdAndUpdate(fieldId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedField) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFieldById = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const field = await fieldModel.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteField = async (req, res) => {
  try {
    const fieldId = req.params.id;
    const deletedField = await fieldModel.findByIdAndDelete(fieldId);
    if (!deletedField) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFields,
  createField,
  updateField,
  getFieldById,
  deleteField,
};
