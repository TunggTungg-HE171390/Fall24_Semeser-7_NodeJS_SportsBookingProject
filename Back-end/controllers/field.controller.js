const mongoose = require("mongoose");
const Field = require("../models/field.model");
const User = require("../models/user.model");

// Hàm tạo các subFields dựa trên tổng số sân, giờ mở/đóng cửa và thời gian mỗi ca
function generateSubFields(
  totalFields,
  openingTime,
  closingTime,
  slotDuration
) {
  console.log(totalFields, openingTime, closingTime, slotDuration);

  const subFields = [];
  const openingDate = new Date(`1970-01-01T${openingTime}:00`);
  const closingDate = new Date(`1970-01-01T${closingTime}:00`);

  const totalOperatingTime =
    (Number(closingDate) - Number(openingDate)) / (1000 * 60); // convert to minutes
  const slotsPerDay = Math.floor(totalOperatingTime / +slotDuration);

  for (let i = 1; i <= totalFields; i++) {
    const subField = {
      name: `Sân ${i}`,
      fieldTime: [],
    };

    let startTime = new Date(openingDate);

    for (let j = 0; j < slotsPerDay; j++) {
      const endTime = new Date(startTime.getTime() + slotDuration * 60000);

      // Format to "HH:MM"
      const formattedStart = startTime.toTimeString().slice(0, 5);
      const formattedEnd = endTime.toTimeString().slice(0, 5);

      subField.fieldTime.push({
        start: formattedStart, // store only "HH:MM"
        end: formattedEnd, // store only "HH:MM"
        status: 1,
      });

      startTime = new Date(endTime);
    }

    subFields.push(subField);
  }

  return subFields;
}

// Hàm thêm Field mới
const addField = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);

    const {
      totalFields,
      openingTime,
      closingTime,
      slotDuration,
      ownerId,
      price,
    } = data;
    const ownerExists = await User.findById(ownerId);

    if (!ownerExists) {
      return res
        .status(400)
        .json({ message: "Invalid ownerId: User does not exist" });
    }

    const subFields = generateSubFields(
      totalFields,
      openingTime,
      closingTime,
      slotDuration
    );
    const field = new Field({ ...data, subFields });

    const savedField = await field.save();
    res.status(201).json({
      message: "Field added successfully!",
      data: savedField,
    });
  } catch (error) {
    next(error);
  }
};

// Hàm cập nhật Field
const updateField = async (req, res, next) => {
  try {
    const fieldId = req.params.id;
    const updateData = req.body;
    console.log(updateData);

    const {
      ownerId,
      totalFields,
      openingTime,
      closingTime,
      slotDuration,
      price,
    } = updateData;

    if (ownerId) {
      const ownerExists = await User.findById(ownerId);
      if (!ownerExists) {
        return res
          .status(400)
          .json({ message: "Invalid ownerId: User does not exist" });
      }
    }

    if (totalFields && openingTime && closingTime && slotDuration) {
      updateData.subFields = generateSubFields(
        totalFields,
        openingTime,
        closingTime,
        slotDuration
      );
      console.log(updateData.subFields);
    }

    const updatedField = await Field.findByIdAndUpdate(fieldId, updateData, {
      new: true,
    });
    if (!updatedField) {
      return res.status(404).json({ message: "Field not found." });
    }
    res.status(200).json(updatedField);
  } catch (error) {
    next(error);
  }
};

// Hàm xóa Field
const deleteField = async (req, res, next) => {
  try {
    const fieldId = req.params.id;

    // Lấy field hiện tại
    const field = await Field.findById(fieldId);

    if (!field) {
      return res.status(404).json({ message: "Field not found." });
    }

    // Đổi trạng thái giữa ACTIVE và INACTIVE
    const newStatus = field.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    field.status = newStatus;

    // Lưu lại trạng thái mới
    await field.save();

    res
      .status(200)
      .json({
        message: `Field status changed to ${newStatus} successfully!`,
        field,
      });
  } catch (error) {
    next(error);
  }
};

// Hàm lấy danh sách các Field với phân trang và tìm kiếm theo tên
const getFields = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      searchQuery = "",
      sortOrder = "asc",
      sportName,
    } = req.query;
    const skip = (page - 1) * limit;

    // Build the query object based on search query and sport filter
    const query = {
      ...(searchQuery ? { name: { $regex: searchQuery, $options: "i" } } : {}),
      ...(sportName ? { sportName } : {}),
    };

    // Determine sort order
    const sort = { price: sortOrder === "asc" ? 1 : -1 };

    // Execute the query with filters, sorting, and pagination
    const fields = await Field.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total fields for pagination
    const totalFields = await Field.countDocuments(query);
    const totalPages = Math.ceil(totalFields / limit);

    res.status(200).json({
      data: fields,
      currentPage: parseInt(page),
      totalPages,
      totalFields,
    });
  } catch (error) {
    next(error);
  }
};

// Hàm lấy chi tiết Field theo fieldId
const getFieldById = async (req, res, next) => {
  try {
    const fieldId = req.params.id;

    const field = await Field.findById(fieldId)
      .populate("ownerId", "name")
      .populate("feedBackId");

    if (!field) {
      return res.status(404).json({ message: "Field not found." });
    }

    res.status(200).json(field);
  } catch (error) {
    next(error);
  }
};

// Export các hàm để sử dụng trong các phần khác của ứng dụng
module.exports = {
  addField,
  updateField,
  deleteField,
  getFields,
  getFieldById,
};
