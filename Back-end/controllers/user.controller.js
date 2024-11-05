const userModel = require("../models/user.model");
const { sendEmail, generateAuthCode } = require("./mailService.controller");
const bcrypt = require("bcrypt");
require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsersFromAdmin = async (req, res) => {
  try {
    const countRole = req.query.countRole;

    if (countRole === "count") {
      const users = await userModel.find({ status: 1 });
      const roleCounts = users.reduce(
        (acc, user) => {
          if (user.role === 1) acc.customer++;
          else if (user.role === 2) acc.fieldOwner++;
          return acc;
        },
        { customer: 0, fieldOwner: 0 }
      );

      // Trả về kết quả
      res.status(200).json(roleCounts);
    } else {
      const users = await userModel.find({ status: 1 });
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ error: { status: 500, message: error.message } });
  }
};

const changeUserStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    // Tìm người dùng theo id để lấy role
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra role của người dùng
    if (user.role === 3) {
      return res
        .status(403)
        .json({ message: "Cannot change status for users with role 3" });
    }

    // Cập nhật status nếu role khác 3
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = await userModel.findById(req.params.id);

    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }
    if (req.body.oldPassword === req.body.newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password",
      });
    }

    let attempts = 3;
    let isMatch = false;

    while (attempts > 0) {
      isMatch = await bcrypt.compare(
        req.body.oldPassword,
        userId.account.password
      );

      if (isMatch) {
        break;
      } else {
        attempts--;
        if (attempts > 0) {
          return res.status(400).json({
            message: "Wrong password",
            warning: `You have ${attempts} attempts left.`,
          });
        } else {
          return res.status(400).json({
            message: "Wrong password",
            warning: "No attempts left. Please try again later.",
          });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(
      req.body.newPassword,
      parseInt(process.env.SECRET_PASSWORD)
    );
    userId.account.password = hashedPassword;
    await userId.save();

    return res.status(200).json({
      message: "Change password successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userInfo = await userModel.findById(req.params.id);
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newPhone = req.body.phone;
    const newName = req.body.name;
    console.log(newName);

    if (newName !== undefined) {
      const checkNameExist = await userModel.findOne({
        "profile.name": newName,
        _id: { $ne: userId },
      }); //bỏ qua user mình
      if (checkNameExist) {
        return res.status(400).json({ message: "Name already exists" });
      }
    }

    if (newPhone !== undefined) {
      const checkPhoneExist = await userModel.findOne({
        "profile.phone": newPhone,
        _id: { $ne: userId },
      });
      if (checkPhoneExist) {
        return res.status(400).json({ message: "Phone already exists" });
      }
    }

    const updateInfo = {};

    if (newName !== undefined) {
      updateInfo["profile.name"] = newName;
    }
    if (newPhone !== undefined) {
      updateInfo["profile.phone"] = newPhone;
    }

    if (Object.keys(updateInfo).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateInfo, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const editUserFromAdmin = async (req, res, next) => {
  try {
    const { id, name, phone, role } = req.body;

    const updateInfo = {
      "profile.phone": phone,
      "profile.name": name,
      role: role,
    };

    const updatedUser = await userModel.findByIdAndUpdate(id, updateInfo, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ "account.email": req.body.email });

    console.log(`Email: ${req.body.email}`);
    console.log(`User `, user);
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại." });
    }

    const authCode = generateAuthCode();
    console.log(authCode);
    const hashedPassword = await bcrypt.hash(
      authCode,
      parseInt(process.env.SECRET_PASSWORD)
    );
    console.log(hashedPassword);
    user.set((user.account.password = hashedPassword));
    console.log(user.account.password);
    await user.save();
    console.log(hashedPassword);
    await sendEmail(req.body.email, user.profile.name, authCode);
    res
      .status(200)
      .json({ message: "Mã xác thực đã được gửi đến email của bạn." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  changePassword,
  getUserById,
  updateUser,
  forgotPassword,
  changeUserStatus,
  getAllUsersFromAdmin,
  editUserFromAdmin,
};
