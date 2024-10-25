const userModel = require("../models/user.model");
const { sendEmail,generateAuthCode } = require('./mailService.controller');
const bcrypt = require("bcrypt");
require('dotenv').config();

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = await userModel.findById(req.params.id);

    if (!userId) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required"
      });
    }
    if (req.body.oldPassword === req.body.newPassword) {
      return res.status(400).json({
        message: "New password must be different from old password"
      });
    }

    let attempts = 3;
    let isMatch = false;

    while (attempts > 0) {
      isMatch = await bcrypt.compare(req.body.oldPassword, userId.account.password);

      if (isMatch) {
        break;
      } else {
        attempts--;
        if (attempts > 0) {
          return res.status(400).json({
            message: "Wrong password",
            warning: `You have ${attempts} attempts left.`
          });
        } else {
          return res.status(400).json({
            message: "Wrong password",
            warning: "No attempts left. Please try again later."
          });
        }
      }
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, parseInt(process.env.SECRET_PASSWORD));
    userId.account.password = hashedPassword;
    await userId.save();

    return res.status(200).json({
      message: "Change password successfully"
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
}
const updateUser = async (req, res, next) => {
  try {
    const newPhone = req.body.phone;
    const newAvatar = req.body.avatar;

    const updateInfo = {
      "profile.phone": newPhone,
      "profile.avatar": newAvatar
    }

    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, updateInfo, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ "account.email": req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    const authCode = generateAuthCode()
    console.log(authCode);
    const hashedPassword = await bcrypt.hash(authCode, parseInt(process.env.SECRET_PASSWORD));
    console.log(hashedPassword);
    user.set(user.account.password=hashedPassword);
    console.log(user.account.password);
    await user.save();    
    console.log(hashedPassword);
    await sendEmail(req.body.email, user.profile.name, authCode);
    res.status(200).json({ message: 'Mã xác thực đã được gửi đến email của bạn.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  changePassword,
  getUserById,
  updateUser,
  forgotPassword
};
