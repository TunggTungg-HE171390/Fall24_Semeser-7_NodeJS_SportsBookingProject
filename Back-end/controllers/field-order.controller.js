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

// Create a new field order
const createFieldOrder = async (req, res) => {
  try {
    const {
      customerId,
      fieldId,
      subFieldId,
      slotId,
      orderDate,
      status,
      equipmentOrderId,
    } = req.body;

    // Validate entity existence
    await checkExistence(customerId, fieldId, subFieldId, slotId);

    // Validate order date
    if (orderDate && new Date(orderDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Order date must be in the present or future." });
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

    // Retrieve all booked slots for the day for the specific field
    const bookedSlots = await FieldOrders.find({
      fieldId,
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    }).select("subFieldId slotId");

    const bookedSubFields = bookedSlots.map((slot) => ({
      subFieldId: slot.subFieldId,
      slotId: slot.slotId,
    }));

    // Retrieve field data to get available slots
    const field = await Fields.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    const availableSlots = field.subFields.map((subField) => ({
      name: subField.name,
      subFieldId: subField._id,
      availableSlots: subField.fieldTime.filter(
        (slot) =>
          !bookedSubFields.some(
            (booked) =>
              booked.subFieldId.equals(subField._id) &&
              booked.slotId.equals(slot._id)
          )
      ),
    }));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getFieldOrdersByCustomerId(req, res, next) {
  try {
    console.log(req.params.customerId);
    const field_orders = await db.fieldOrder.find({ customerId: req.params.customerId })
      .populate("customerId", "profile.name")
      .populate({
        path: "equipmentOrderId",
        populate: {
          path: "equipments.equipment_id",
          model: "Equipments",
          select: "equipmentName"
        }
      })
      .populate({
        path: "fieldId",
        select: "name sportName subFields",
      });

    const formattedFieldOrders = field_orders.map((order) => {
      const selectedSubField = order.fieldId?.subFields?.find(
        (subField) => subField._id.toString() === order.subFieldId.toString()
      );

      const selectedSlot = selectedSubField?.fieldTime?.find(
        (slot) => slot._id.toString() === order.slotId.toString()
      );

      return {
        _id: order._id,
        customerName: order.customerId.profile.name,
        fieldId: order.fieldId,
        fieldName: order.fieldId?.name,
        orderDate: new Date(order.orderDate).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        subFieldName: selectedSubField?.name || null,
        fieldTime: selectedSlot ? `${selectedSlot.start} - ${selectedSlot.end}` : null,

        equipmentOrder: order.equipmentOrderId.map((e) => ({
          equipmentName: e.equipments.map((eName) => eName.equipment_id.equipmentName),
          quantity: e.equipments.map((q) => q.quantity),
          price: e.equipments.map((p) => p.price),
        })),
        totalPrice: order.equipmentOrderId.reduce((total, e) => {
          return total + e.equipments.reduce((subTotal, equipment) => {
            return subTotal + (equipment.price * equipment.quantity);
          }, 0);
        }, 0),
      };
    });

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
    console.log(req.params.id);
    const detail_field_orders = await db.fieldOrder
      .findOne({ _id: req.params.id })
      .populate("customerId", "profile.name")
      .populate({
        path: "equipmentOrderId",
        populate: {
          path: "equipments.equipment_id",
          model: "Equipments",
          select: "equipmentName"
        }
      })
      .populate({
        path: "fieldId",
        select: "name sportName subFields",
      });

    if (!detail_field_orders) {
      return res.status(404).json({
        message: "Field order not found",
        data: detail_field_orders,
      });
    }

    // Tìm kiếm subField theo subFieldId
    const selectedSubField = detail_field_orders.fieldId
      ?.subFields?.find(
        (subField) => subField._id.toString() === detail_field_orders.subFieldId.toString())
      ;

    // Tìm kiếm slot theo slotId
    const selectedSlot = selectedSubField?.fieldTime?.find(
      (slot) => slot._id.toString() === detail_field_orders.slotId.toString()
    );

    console.log("Field ID:", detail_field_orders.fieldId);
    console.log("SubField ID:", detail_field_orders.subFieldId);
    console.log("Selected SubField:", selectedSubField);

    const feedbacks = detail_field_orders.fieldId._id

    const feedbackinField = await db.field.findById(feedbacks).populate("feedBackId");


    const checkFeedbackExist = feedbackinField.feedBackId.find((feedback) => feedback.customerId.toString() === detail_field_orders.customerId._id.toString());
    console.log("feedbacks.feedBackId: ", detail_field_orders.price)

    let starRating = checkFeedbackExist ? checkFeedbackExist.starNumber : 0;
    let starSymbols = "⭐".repeat(starRating) + "⭐".repeat(5 - starRating);


    let checkFeedback = "";
    if (!checkFeedbackExist) {
      checkFeedback = 'Bạn chưa đánh giá về trải nghiệm ở sân này. ';
      console.log('User has not commented on this field.');
    } else {
      checkFeedback = `Bạn đã đánh giá: ${starSymbols}`;
      console.log('User has commented on this field.');
    }

    const formattedFieldOrders = {
      _id: detail_field_orders._id,
      fieldId: detail_field_orders.fieldId._id,
      customerId: detail_field_orders.customerId._id,
      customerName: detail_field_orders.customerId?.profile?.name,
      fieldName: detail_field_orders.fieldId?.name,
      orderDate: new Date(detail_field_orders.orderDate).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),

      subFieldName: selectedSubField?.name || null,
      fieldTime: selectedSlot.start + " - " + selectedSlot.end,
      fieldPrice: detail_field_orders.price,

      equipmentOrder: detail_field_orders.equipmentOrderId.map((e) => ({
        equipmentName: e.equipments.map((eName) => eName.equipment_id.equipmentName),
        quantity: e.equipments.map((q) => q.quantity),
        price: e.equipments.map((p) => p.price),
      })),
      totalPrice: detail_field_orders.price + detail_field_orders.equipmentOrderId.reduce((total, e) => {
        return total + e.equipments.reduce((subTotal, equipment) => {
          return subTotal + (equipment.price * equipment.quantity);
        }, 0);
      }, 0),
      Feedback: checkFeedback
    };

    console.log(formattedFieldOrders);

    res.status(200).json({
      message: "Get field orders successfully",
      data: formattedFieldOrders,
    });
  } catch (error) {
    next(error);
  }
}

async function getCountFieldOrderByCustomerId(req, res, next) {
  try {
    const count = await db.fieldOrder.countDocuments({ customerId: req.params.id })
    console.log(count);
    res.status(200).json({
      message: "Get count field orders successfully",
      data: count,
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
  getCountFieldOrderByCustomerId
};
