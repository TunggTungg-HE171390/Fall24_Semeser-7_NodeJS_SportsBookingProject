const mongoose = require("mongoose");
const Field = require("../models/field.model");

// Hàm tạo các subFields dựa trên tổng số sân, giờ mở/đóng cửa và thời gian mỗi ca
function generateSubFields(
  totalFields,
  openingTime,
  closingTime,
  slotDuration
) {
  const subFields = [];
  const openingDate = new Date(`1970-01-01T${openingTime}:00`);
  const closingDate = new Date(`1970-01-01T${closingTime}:00`);

  const totalOperatingTime = (closingDate - openingDate) / (1000 * 60); // chuyển đổi thời gian thành phút
  const slotsPerDay = Math.floor(totalOperatingTime / slotDuration);

  for (let i = 1; i <= totalFields; i++) {
    const subField = {
      name: `Sân ${i}`,
      fieldTime: [],
    };

    let startTime = new Date(openingDate);

    for (let j = 0; j < slotsPerDay; j++) {
      const endTime = new Date(startTime.getTime() + slotDuration * 60000);

      subField.fieldTime.push({
        start: new Date(startTime),
        end: new Date(endTime),
        price: 0, // Giá mặc định, có thể cập nhật sau
        status: 1, // Trạng thái mặc định
      });

      startTime = new Date(endTime);
    }

    subFields.push(subField);
  }

  return subFields;
}

// Hàm thêm Field mới
async function addField(data) {
  try {
    const { totalFields, openingTime, closingTime, slotDuration } = data;
    const subFields = generateSubFields(
      totalFields,
      openingTime,
      closingTime,
      slotDuration
    );
    const field = new Field({ ...data, subFields });
    await field.save();
    console.log("Field added successfully!");
  } catch (error) {
    console.error("Error adding field:", error);
  }
}

// Hàm cập nhật Field
async function updateField(fieldId, updateData) {
  try {
    const { totalFields, openingTime, closingTime, slotDuration } = updateData;
    if (totalFields && openingTime && closingTime && slotDuration) {
      updateData.subFields = generateSubFields(
        totalFields,
        openingTime,
        closingTime,
        slotDuration
      );
    }
    const updatedField = await Field.findByIdAndUpdate(fieldId, updateData, {
      new: true,
    });
    if (updatedField) {
      console.log("Field updated successfully!");
    } else {
      console.log("Field not found.");
    }
  } catch (error) {
    console.error("Error updating field:", error);
  }
}

// Hàm xóa Field
async function deleteField(fieldId) {
  try {
    const deletedField = await Field.findByIdAndDelete(fieldId);
    if (deletedField) {
      console.log("Field deleted successfully!");
    } else {
      console.log("Field not found.");
    }
  } catch (error) {
    console.error("Error deleting field:", error);
  }
}

// Hàm lấy danh sách các Field với phân trang
async function getFields(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit; // Bỏ qua số lượng bản ghi dựa trên trang hiện tại
    const fields = await Field.find().skip(skip).limit(limit);

    const totalFields = await Field.countDocuments(); // Tổng số lượng Field
    const totalPages = Math.ceil(totalFields / limit);

    return {
      data: fields,
      currentPage: page,
      totalPages,
      totalFields,
    };
  } catch (error) {
    console.error("Error fetching fields list:", error);
    throw error;
  }
}

// Hàm lấy chi tiết Field theo fieldId
async function getFieldById(fieldId) {
  try {
    const field = await Field.findById(fieldId)
      .populate("ownerId", "name") // Lấy thông tin tên của người sở hữu sân từ Users
      .populate("feedBackId"); // Lấy thông tin phản hồi từ Feedbacks

    if (!field) {
      console.log("Field not found.");
      return null;
    }
    return field;
  } catch (error) {
    console.error("Error fetching field details:", error);
    throw error;
  }
}

// Export các hàm để sử dụng trong các phần khác của ứng dụng
module.exports = {
  addField,
  updateField,
  deleteField,
  getFields,
  getFieldById,
};
