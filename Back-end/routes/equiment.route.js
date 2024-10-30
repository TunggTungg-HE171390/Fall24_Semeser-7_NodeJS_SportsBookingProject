const express = require("express");
const {
  getAllEquipments,
  createEquipment,
  updateEquipment,
  getEquipmentById,
  deleteEquipment,
  rentalEquipment,
} = require("../controllers/equipment.controller");

const router = express.Router();

// Get all equipments
router.get("/", getAllEquipments);

// Get a single equipment by ID
router.get("/:id", getEquipmentById);

// Create a new equipment
router.post("/", createEquipment);

// Update an existing equipment by ID
router.put("/update/:id", updateEquipment);

// "Soft delete" an equipment by updating its status
router.put("/delete/:id", deleteEquipment);

router.post("/rental", rentalEquipment);

module.exports = router;
