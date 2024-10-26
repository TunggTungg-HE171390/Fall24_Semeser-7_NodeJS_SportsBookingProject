const userModel = require("../models/user.model");
const JwtProvider = require("../providers/JwtProvider");
const ms = require("ms");

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

const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({
      account: { email: req.body.email, password: req.body.password },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Muốn bổ sung gì vào token thì thêm ở đây
    const userInfo = {
      _id: user._id,
      email: user.account.email,
      role: user.role,
    };

    //Tạo ra 2 loại token: access token và refresh token
    //Cả 2 cái đều dùng SECRET_KEY
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.SECRET_KEY,
      process.env.ExpIn
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.SECRET_KEY,
      "7d"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("7d"),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("7d"),
    });

    res.status(200).json({
      ...userInfo,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  login,
};
