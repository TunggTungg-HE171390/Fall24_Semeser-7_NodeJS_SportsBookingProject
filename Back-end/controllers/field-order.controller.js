const FieldOrders = require("../models/field-order.model");
const Fields = require("../models/field.model");

// Get all field orders
const getAllFieldOrders = async (req, res) => {
  try {
    const orders = await FieldOrders.find()
      .populate("customerId")
      .populate("fieldTime.fieldId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new field order
const createFieldOrder = async (req, res) => {
  try {
    const { customerId, fieldTime, orderDate, status, equipmentOrderId } =
      req.body;

    console.log(req.body);

    // Validate order date
    if (orderDate && new Date(orderDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Order date must be in the present or future." });
    }

    // Check if the requested time slots are available
    for (const time of fieldTime) {
      if (
        new Date(time.start) < new Date() ||
        new Date(time.end) < new Date()
      ) {
        return res
          .status(400)
          .json({ message: "Booking times must be in the present or future." });
      }
      const isAvailable = await isTimeSlotAvailable(
        time.fieldId,
        time.start,
        time.end
      );
      if (!isAvailable) {
        return res.status(400).json({
          message: `Field ${time.fieldId} is already booked for the requested time.`,
        });
      }
    }

    const newOrder = new FieldOrders({
      customerId,
      fieldTime,
      orderDate,
      status,
      equipmentOrderId,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing field order
const updateFieldOrder = async (req, res) => {
  try {
    const { customerId, fieldTime, orderDate, status, equipmentOrderId } =
      req.body;

    // Validate order date
    if (orderDate && new Date(orderDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Order date must be in the present or future." });
    }

    // Check if the requested time slots are available
    for (const time of fieldTime) {
      if (
        new Date(time.start) < new Date() ||
        new Date(time.end) < new Date()
      ) {
        return res
          .status(400)
          .json({ message: "Booking times must be in the present or future." });
      }
      const isAvailable = await isTimeSlotAvailable(
        time.fieldId,
        time.start,
        time.end,
        req.params.id
      );
      if (!isAvailable) {
        return res.status(400).json({
          message: `Field ${time.fieldId} is already booked for the requested time.`,
        });
      }
    }

    const updatedOrder = await FieldOrders.findByIdAndUpdate(
      req.params.id,
      { customerId, fieldTime, orderDate, status, equipmentOrderId },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific field order by ID
const getFieldOrderById = async (req, res) => {
  try {
    const order = await FieldOrders.findById(req.params.id)
      .populate("customerId")
      .populate("fieldTime.fieldId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific field order
const deleteFieldOrder = async (req, res) => {
  try {
    const deletedOrder = await FieldOrders.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get available slots for a specific field on a specific date
const getAvailableSlotsForField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSlots = await FieldOrders.find({
      "fieldTime.fieldId": fieldId,
      $or: [
        { "fieldTime.start": { $gte: startOfDay, $lte: endOfDay } },
        { "fieldTime.end": { $gte: startOfDay, $lte: endOfDay } },
      ],
    });

    const bookedTimes = bookedSlots.flatMap((order) =>
      order.fieldTime.map((time) => ({
        start: time.start,
        end: time.end,
      }))
    );

    const field = await Fields.findById(fieldId);
    const availableSlots = field.fieldTime.filter((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      return !bookedTimes.some(
        (booked) => slotStart < booked.end && slotEnd > booked.start
      );
    });

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function for checking slot availability
async function isTimeSlotAvailable(fieldId, start, end, excludeOrderId = null) {
  const overlappingOrders = await FieldOrders.findOne({
    "fieldTime.fieldId": fieldId,
    $or: [{ "fieldTime.start": { $lt: end }, "fieldTime.end": { $gt: start } }],
    ...(excludeOrderId && { _id: { $ne: excludeOrderId } }),
  });
  return !overlappingOrders;
}

module.exports = {
  getAllFieldOrders,
  createFieldOrder,
  updateFieldOrder,
  getFieldOrderById,
  deleteFieldOrder,
  getAvailableSlotsForField,
};
