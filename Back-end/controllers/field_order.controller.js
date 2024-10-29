const db = require("../models");

async function getFieldOrdersByCustomerId(req, res, next) {
  try {
    console.log(req.params.id);
    const field_orders = await db.fieldOrder.find({ customerId: req.params.id })
      .populate("customerId", "profile.name")
      .populate({
        path: "equipmentOrderId",
        populate: {
          path: "equipments.equipmentId",
          model: "Equipments",
          select: "equipmentName"
        }
      })
      .populate({
        path: "fieldTime.fieldId",
        model: "Fields",
        select: "name"
      });

    const formattedFieldOrders = field_orders.map(order => ({
      _id: order._id,
      customerName: order.customerId?.profile?.name,
      fieldTime: order.fieldTime.map(time => ({
        fieldName: time.fieldId?.name,
        start: time.start,
        end: time.end
      })),
      equipmentOrder: order.equipmentOrderId.equipments.map(e => ({
        equipmentName: e.equipmentId?.equipmentName,
        quantity: e.quantity,
        totalPrice: e.price * e.quantity
      }))
    }));

    console.log(formattedFieldOrders);

    res.status(200).json({
      message: "Get field orders successfully",
      data: formattedFieldOrders
    });
  } catch (error) {
    next(error);
  }
}

async function getDetailByFieldOrdersId(req, res, next) {
  try {
    const detail_field_orders = await db.fieldOrder.findOne({ _id: req.params.id })
      .populate("customerId", "profile.name")
      .populate({
        path: "fieldTime.fieldId",
        model: "Fields",
        select: "name"
      });

    // Kiểm tra nếu không tìm thấy đơn đặt hàng nào
    if (!detail_field_orders) {
      return res.status(404).json({
        message: "Field order not found"
      });
    }

    const formattedFieldOrders = {
      _id: detail_field_orders._id,
      customerName: detail_field_orders.customerId?.profile?.name,
      fieldTime: detail_field_orders.fieldTime.map(time => ({
        fieldName: time.fieldId?.name,
        start: new Date(time.start).toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        end: new Date(time.end).toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      })),
      equipmentOrder: detail_field_orders.equipmentOrderId
    };

    res.status(200).json({
      message: "Get field orders successfully",
      data: formattedFieldOrders
    });

  } catch (error) {
    next(error);
  }
}


const Field_OrderController = {
  getFieldOrdersByCustomerId,
  getDetailByFieldOrdersId
};

module.exports = Field_OrderController;