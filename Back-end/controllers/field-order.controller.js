const FieldOrders = require("../models/field-order.model");
const Fields = require("../models/field.model");
const Users = require("../models/user.model");
const db = require("../models");

// Helper function for checking slot availability
async function isSlotAvailable(
  fieldId,
  subFieldId,
  slotId,
  excludeOrderId = null
) {
  const overlappingOrder = await FieldOrders.findOne({
    fieldId,
    subFieldId,
    slotId,
    ...(excludeOrderId && { _id: { $ne: excludeOrderId } }),
  });
  return !overlappingOrder;
}

// Check existence of related entities
async function checkExistence(userId, fieldId, subFieldId, slotId) {
  const userExists = await Users.findById(userId);
  if (!userExists) throw new Error("User does not exist");

  const fieldExists = await Fields.findById(fieldId);
  if (!fieldExists) throw new Error("Field does not exist");

  const subFieldExists = fieldExists.subFields.id(subFieldId);
  if (!subFieldExists) throw new Error("SubField does not exist");

  const slotExists = subFieldExists.fieldTime.id(slotId);
  if (!slotExists) throw new Error("Slot does not exist");
}

// Get all field orders
const getAllFieldOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided
    const skip = (page - 1) * limit;

    const orders = await FieldOrders.find()
      .skip(skip)
      .limit(parseInt(limit))
      .populate("customerId")
      .populate("fieldId")
      .populate("subFieldId");

    // Get the total count of orders for pagination info
    const totalOrders = await FieldOrders.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      data: orders,
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getFieldOrdersForDashboard = async (req, res) => {
//   try {
//     const orders = await FieldOrders.find({ status: "Completed" })
//       .select("-_id price")

//       .populate({
//         path: "fieldId",
//         select: "-_id ownerId",
//         populate: {
//           path: "ownerId",
//           select: "profile.name -_id",
//         },
//       });
//     // .populate({
//     //   path: "equipmentOrderId",
//     //   // select: "-_id ownerId",
//     //   // populate: {
//     //   //   path: "ownerId",
//     //   //   select: "profile.name -_id",
//     //   // },
//     // });

//     res.status(200).json({
//       orders,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Create a new field order

const getFieldOrdersForDashboard = async (req, res) => {
  try {
    const orders = await FieldOrders.find({ status: "Completed" })
      .select("price")
      .populate({
        path: "fieldId",
        select: "ownerId",
        populate: {
          path: "ownerId",
          select: "profile.name",
        },
      });

    // Tạo một đối tượng để lưu trữ tổng tiền của từng owner
    const ownerTotals = {};

    // Sử dụng map để lặp qua mỗi đơn hàng và tính tổng tiền cho mỗi chủ sở hữu
    orders.map((order) => {
      const ownerName = order.fieldId.ownerId.profile.name;
      const price = order.price;

      // Nếu owner đã tồn tại trong đối tượng ownerTotals, cộng thêm giá, nếu không thì khởi tạo
      if (ownerTotals[ownerName]) {
        ownerTotals[ownerName] += price;
      } else {
        ownerTotals[ownerName] = price;
      }
    });

    // Chuyển đổi đối tượng thành một mảng kết quả
    const result = Object.keys(ownerTotals).map((ownerName) => ({
      ownerName,
      totalAmount: ownerTotals[ownerName],
    }));

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFieldOrder = async (req, res) => {
  try {
    console.log(req.body);

    const {
      customerId,
      fieldId,
      subFieldId,
      slotId,
      orderDate,
      status,
      equipmentOrderId,
      price,
    } = req.body;

    // Validate entity existence
    await checkExistence(customerId, fieldId, subFieldId, slotId);

    // Validate order date
    if (orderDate) {
      const currentDate = new Date();
      const orderDateOnly = new Date(orderDate);

      // Set the time components to zero for both dates to ignore hours, minutes, and seconds
      currentDate.setHours(0, 0, 0, 0);
      orderDateOnly.setHours(0, 0, 0, 0);

      if (orderDateOnly < currentDate) {
        return res
          .status(400)
          .json({ message: "Order date must be in the present or future." });
      }
    }

    // Check if the slot is available for the specific field and subField
    const isAvailable = await isSlotAvailable(fieldId, subFieldId, slotId);
    if (!isAvailable) {
      return res.status(400).json({
        message: `Slot in SubField ${subFieldId} is already booked for the requested time.`,
      });
    }

    const newOrder = new FieldOrders({
      customerId,
      fieldId,
      subFieldId,
      slotId,
      orderDate,
      status,
      equipmentOrderId,
      price,
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
    const {
      customerId,
      fieldId,
      subFieldId,
      slotId,
      orderDate,
      status,
      equipmentOrderId,
      price,
    } = req.body;

    // Validate entity existence
    await checkExistence(customerId, fieldId, subFieldId, slotId);

    // Validate order date
    if (orderDate && new Date(orderDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Order date must be in the present or future." });
    }

    // Check if the slot is available, excluding the current order
    const isAvailable = await isSlotAvailable(
      fieldId,
      subFieldId,
      slotId,
      req.params.id
    );
    if (!isAvailable) {
      return res.status(400).json({
        message: `Slot in SubField ${subFieldId} is already booked for the requested time.`,
      });
    }

    const updatedOrder = await FieldOrders.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        fieldId,
        subFieldId,
        slotId,
        orderDate,
        status,
        equipmentOrderId,
        price,
      },
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
      .populate("fieldId")
      .populate("subFieldId");

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

// Get available slots for a specific field and date
const getAvailableSlotsForField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { date, subFieldId } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required" });
    }

    console.log(`Date: ${date}`);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if the selected date is today
    const today = new Date();
    const isToday =
      startOfDay.getDate() === today.getDate() &&
      startOfDay.getMonth() === today.getMonth() &&
      startOfDay.getFullYear() === today.getFullYear();
    console.log(isToday);

    // Retrieve all booked slots for the day for the specific field and subFieldId if provided
    const bookedSlotsQuery = {
      fieldId,
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    };
    if (subFieldId) {
      bookedSlotsQuery.subFieldId = subFieldId;
    }

    const bookedSlots = await FieldOrders.find(bookedSlotsQuery).select(
      "subFieldId slotId"
    );

    const bookedSubFields = bookedSlots.map((slot) => ({
      subFieldId: slot.subFieldId,
      slotId: slot.slotId,
    }));

    // Retrieve field data to get available slots
    const field = await Fields.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Get the current time if the selected date is today
    const currentTime = isToday ? new Date() : null;

    console.log(`Current time: ${currentTime}`);

    // Filter for a specific subField or all subFields if no specific subFieldId is provided
    const availableSlots = field.subFields
      .filter((subField) => !subFieldId || subField._id.equals(subFieldId))
      .map((subField) => ({
        name: subField.name,
        subFieldId: subField._id,
        availableSlots: subField.fieldTime.filter((slot) => {
          // Check if the slot is booked
          const isBooked = bookedSubFields.some(
            (booked) =>
              booked.subFieldId.equals(subField._id) &&
              booked.slotId.equals(slot._id)
          );

          // If the slot is booked, skip it
          if (isBooked) return false;

          // If today, only include slots that start after the current time
          if (isToday) {
            // Log the current date and time
            console.log("current time", currentTime);

            // Assuming slot.start is a string like "20:00", split it to get hours and minutes
            const [slotHour, slotMinute] = slot.start.split(":").map(Number);

            // Create a Date object for the slot start time on the current day
            const slotStartTime = new Date(currentTime);
            slotStartTime.setHours(slotHour, slotMinute, 0, 0); // Set hours, minutes, seconds, and milliseconds

            // Log the slot start time
            console.log("slot start time", slotStartTime);

            // Return whether the slot start time is after the current time
            return slotStartTime > currentTime;
          }

          // For future dates, include all available slots
          return true;
        }),
      }));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getFieldOrdersByCustomerId(req, res, next) {
  try {
    console.log(req.params.id);
    const field_orders = await db.fieldOrder
      .find({ customerId: req.params.id })
      .populate("customerId", "profile.name")
      .populate("equipmentOrderId")
      .populate("equipmentOrderId.equipments.equipment_id", "equipmentName")
      .populate({
        path: "fieldTime.fieldId",
        model: "Fields",
        select: "name",
      });

    const formattedFieldOrders = field_orders.map((order) => ({
      _id: order._id,
      customerName: order.customerId?.profile?.name,
      fieldTime: order.fieldTime.map((time) => ({
        fieldName: time.fieldId?.name,
        start: time.start,
        end: time.end,
      })),
      equipmentOrder: order.equipmentOrderId,
    }));

    console.log(formattedFieldOrders);

    res.status(200).json({
      message: "Get field orders successfully",
      data: formattedFieldOrders,
    });
  } catch (error) {
    next(error);
  }
}

async function getDetailByFieldOrdersId(req, res, next) {
  try {
    const detail_field_orders = await db.fieldOrder
      .findOne({ _id: req.params.id })
      .populate("customerId", "profile.name")
      .populate({
        path: "fieldTime.fieldId",
        model: "Fields",
        select: "name",
      });

    // Kiểm tra nếu không tìm thấy đơn đặt hàng nào
    if (!detail_field_orders) {
      return res.status(404).json({
        message: "Field order not found",
      });
    }

    const formattedFieldOrders = {
      _id: detail_field_orders._id,
      customerName: detail_field_orders.customerId?.profile?.name,
      fieldTime: detail_field_orders.fieldTime.map((time) => ({
        fieldName: time.fieldId?.name,
        start: new Date(time.start).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        end: new Date(time.end).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      equipmentOrder: detail_field_orders.equipmentOrderId,
    };

    res.status(200).json({
      message: "Get field orders successfully",
      data: formattedFieldOrders,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllFieldOrders,
  createFieldOrder,
  updateFieldOrder,
  getFieldOrderById,
  deleteFieldOrder,
  getAvailableSlotsForField,
  getFieldOrdersByCustomerId,
  getDetailByFieldOrdersId,
  getFieldOrdersForDashboard,
};
