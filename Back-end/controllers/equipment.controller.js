const equipmentModel = require("../models/equipment.model");

// Get all equipments with pagination
const getAllEquipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, default is 1
    const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const search = req.query.search || ""; // Search term, default is empty

    // Define the search filter, if search term is provided, use regex for case-insensitive search
    const searchQuery = search
      ? { equipmentName: { $regex: search, $options: "i" } }
      : {};

    // Fetch the equipments matching the search criteria, with pagination
    const equipments = await equipmentModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit);

    // Count total equipments matching the search criteria
    const totalEquipments = await equipmentModel.countDocuments(searchQuery);

    res.status(200).json({
      page,
      limit,
      totalEquipments,
      totalPages: Math.ceil(totalEquipments / limit),
      equipments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create new equipment
const createEquipment = async (req, res) => {
  try {
    const equipment = await equipmentModel.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update equipment by ID
const updateEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const updatedEquipment = await equipmentModel.findByIdAndUpdate(
      equipmentId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(200).json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get equipment by ID
const getEquipmentById = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const equipment = await equipmentModel.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// "Soft delete" equipment by updating its status
const deleteEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;

    // Instead of deleting, we update the status to 0 (inactive)
    const updatedEquipment = await equipmentModel.findByIdAndUpdate(
      equipmentId,
      { status: 0 }, // Soft delete by setting status to 0
      { new: true }
    );

    if (!updatedEquipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.status(200).json({
      message: "Equipment status updated to inactive",
      result: updatedEquipment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEquipments,
  createEquipment,
  updateEquipment,
  getEquipmentById,
  deleteEquipment,
};
