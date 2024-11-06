const equipmentOrderModel = require("../models/equipment-order.model");
const equipmentModel = require("../models/equipment.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
// Get all equipments with pagination
const getAllEquipments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, default is 1
    const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const equipmentNameSearch = req.query.equipmentName || ""; // Search term for equipment name
    const sportNameSearch = req.query.sportName || ""; // Search term for sport name

    // Define the search filter based on individual search terms
    const searchQuery = {};
    if (equipmentNameSearch) {
      searchQuery.equipmentName = {
        $regex: equipmentNameSearch,
        $options: "i",
      };
    }
    if (sportNameSearch) {
      searchQuery.sportName = { $regex: sportNameSearch, $options: "i" };
    }

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
// const createEquipment = async (req, res) => {
//   try {
//     const owner = await userModel.findById(req.body.ownerId);

//     if (!owner) {
//       return res.status(404).json({ message: "Owner not found" });
//     }
//     const equipment = await equipmentModel.create(req.body);
//     res.status(201).json(equipment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createEquipment = async (req, res) => {
  try {
    const equipment = await equipmentModel.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update equipment by ID
// const updateEquipment = async (req, res) => {
//   const equipmentId = req.params.id;
//   console.log("eq Id: ", equipmentId);
//   try {
//     // const owner = await userModel.findById(req.body.ownerId);

//     // if (!owner) {
//     //   return res.status(404).json({ message: "Owner not found" });
//     // }
//     const updatedEquipment = await equipmentModel.findByIdAndUpdate(
//       equipmentId,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedEquipment) {
//       return res.status(404).json({ message: "Equipment not found" });
//     }
//     res.status(200).json(updatedEquipment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
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

const rentalEquipment = async (req, res) => {
  const { equipments } = req.body;

  try {
    const rentalEquipments = [];

    for (const item of equipments) {
      console.log(item);

      // Find the equipment by ID
      const equipment = await equipmentModel.findById(item.equipment_id);
      console.log(equipment);

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      // Check if the equipment is available
      if (equipment.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for ${equipment.equipmentName}`,
        });
      }

      // Check if the item already exists in the rentalEquipments array
      const existingRentalItem = rentalEquipments.find(
        (rentalItem) =>
          rentalItem.equipment_id.toString() === equipment._id.toString()
      );

      if (existingRentalItem) {
        // If it exists, increase the quantity
        existingRentalItem.quantity += item.quantity;
      } else {
        // If it doesn't exist, add a new entry to the rentalEquipments array
        rentalEquipments.push({
          equipment_id: equipment._id,
          price: equipment.price,
          quantity: item.quantity,
        });
      }

      // Update the quantity in the equipment inventory
      equipment.quantity -= item.quantity;
      await equipment.save();
    }

    // Create new equipment order
    const equipmentOrder = new equipmentOrderModel({
      customer_id: req.body.customer_id,
      address: req.body.address,
      phone: req.body.phone,
      equipments: rentalEquipments,
      totalPrice: req.body.totalPrice,
    });

    await equipmentOrder.save();

    return res.status(200).json({
      message: "Rental order created successfully",
      order: equipmentOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const buildDateQuery = (filter) => {
  const today = new Date();
  let startDate, endDate;

  switch (filter) {
    case "day":
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "week":
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const lastDayOfWeek = new Date(today);
      lastDayOfWeek.setDate(today.getDate() - today.getDay() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);

      startDate = firstDayOfWeek;
      endDate = lastDayOfWeek;
      break;

    case "month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;

    case "all":
    default:
      return {}; // Trả về điều kiện rỗng để không lọc, hiển thị tất cả đơn hàng
  }

  return startDate && endDate
    ? { createdAt: { $gte: startDate, $lte: endDate } }
    : {};
};

// API to get orders list with time filter
const getOrdersWithTimeFilter = async (req, res) => {
  try {
    const filter = req.params.filter || "all"; // Nếu không có filter, mặc định là 'all'
    const dateQuery = buildDateQuery(filter);

    const orders = await equipmentOrderModel
      .find(dateQuery)
      .populate("customer_id", "name email")
      .populate("equipments.equipment_id", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ total: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// API to get order details by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await equipmentOrderModel
      .findById(id)
      .populate("customer_id", "name email phone")
      .populate("equipments.equipment_id", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
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
  rentalEquipment,
  getOrdersWithTimeFilter,
  getOrderById,
};
