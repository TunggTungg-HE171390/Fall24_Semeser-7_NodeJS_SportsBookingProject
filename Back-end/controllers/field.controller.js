const mongoose = require("mongoose");
const Field = require("../models/field.model");
const User = require("../models/user.model");
const Feedback = require("../models/feedback.model");

// Hàm tạo các subFields dựa trên tổng số sân, giờ mở/đóng cửa và thời gian mỗi ca
function generateSubFields(
  totalFields,
  openingTime,
  closingTime,
  slotDuration,
  price
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
        price: price || 0,
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
      slotDuration,
      price
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
        slotDuration,
        price
      );
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
    const deletedField = await Field.findByIdAndDelete(fieldId);
    if (!deletedField) {
      return res.status(404).json({ message: "Field not found." });
    }
    res.status(200).json({ message: "Field deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

// Hàm lấy danh sách các Field với phân trang và tìm kiếm theo tên
const getFields = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, searchQuery = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

    const fields = await Field.find(query).skip(skip).limit(parseInt(limit));

    const totalFields = await Field.countDocuments(query);
    const totalPages = Math.ceil(totalFields / limit);

    res.status(200).json({
      data: fields,
      currentPage: page,
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

// Xem thông tin chi tiết của sân qua feedbackID


const getFieldByFeedbackId = async (req, res, next) => {
  try {
    const fieldDetail = await Field.findOne({
      feedBackId: { $in: [req.params.feedbackId] }
    }).populate("ownerId", "profile.name");

    console.log(req.params.feedbackId);

    if (!fieldDetail) {
      return res.status(404).json({ message: "Field not found" });
    }

    const getField = await Field.findById(fieldDetail._id)
      .populate({
        path: "feedBackId",
        select: "starNumber detail customerId",
        populate: {
          path: "customerId",
          select: "profile.name"
        }
      });

    const getAllFeedback = getField.feedBackId.map((f) => ({
      starNumber: f.starNumber,
      detail: f.detail,
      customerName: f.customerId ? f.customerId.profile.name : "N/A",
    }));

    res.status(200).json({
      fieldName: getField.name,
      sportName: getField.sportName,
      address: getField.address,
      ownerName: fieldDetail.ownerId ? fieldDetail.ownerId.profile.name : "N/A",
      totalFields: getField.totalFields,
      image: getField.image,
      feedback: getAllFeedback,
    });
  } catch (error) {
    next(error);
  }
};

//Hàm kiểm tra xem field đó userId đã feedback chưa 
const checkFeedbackExist = async (req, res, next) => {
  try {
    const { fieldId, userId } = req.params;

    const field = await Field.findById(fieldId).populate("feedBackId");

    if (!field) {
      console.log('Field not found');
      return { message: 'Field not found' };
    }

    const feedbacks = field.feedBackId.find((feedback) => feedback.customerId.toString() === userId);

    console.log(userId);
    console.log(field.feedBackId.map((feedback) => feedback.customerId.toString()));

    if (!feedbacks) {
      console.log('User has not commented on this field.');
      res.status(200).json({
        message: 'User has not commented on this field.',
      })
    }else{
      console.log('User has not commented on this field.');
      res.status(200).json({
        message: 'OKKKK',
      })
    }
  } catch (error) {
    console.error('Error checking user feedback:', error);
  }
}

const getAllField = async (req, res, next) => {
  try {
    const fields = await Field.find();
    res.status(200).json(fields);
  } catch (error) {
    console.error('Error checking user feedback:', error);
  }
}


module.exports = {
  addField,
  updateField,
  deleteField,
  getFields,
  getFieldById,
  getFieldByFeedbackId,
  checkFeedbackExist,
  getAllField
};
