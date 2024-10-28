const jwt = require("jsonwebtoken");

// Function tạo mới một token
// Cần 3 tham số:
// userInfo: những thông tin đính kèm vào token (payload)
// secretKey: Chữ ký bí mật
// tokenLife : Thời gian sống của 1 token
const generateToken = async (userInfo, secretKey, tokenLife) => {
  try {
    return jwt.sign(userInfo, secretKey, {
      algorithm: process.env.ALGORITHM,
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

// Kiểm tra token hợp lệ: cái token tạo ra có đúng với secretKey không
const verifyToken = async (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
