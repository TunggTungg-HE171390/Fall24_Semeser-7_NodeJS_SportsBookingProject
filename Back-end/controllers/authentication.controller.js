const db = require("../models");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

async function signUp(req, res, next) {
    try {
        if (req.body) {
            const hashedPassword = await bcrypt.hash(req.body.account.password, parseInt(process.env.SECRET_PASSWORD));
            console.log(hashedPassword);
            let setRole;
            if (req.body.role) {
                // Nếu admin tạo tài khoản cho người khác, vai trò mặc định là 2
                setRole = 2;
            } else {
                // Người dùng tự đăng ký, vai trò mặc định là 3
                setRole = 3;
            }

            const newUser = new db.user({
                account: {
                    email: req.body.account.email,
                    password: hashedPassword // Gán mật khẩu đã mã hóa
                },
                role: setRole, // Gán vai trò theo điều kiện
                profile: {
                    name: req.body.profile.name,
                    phone: req.body.profile.phone,
                    avatar: req.body.profile.avatar || "" // Nếu không có avatar thì để chuỗi rỗng
                },
                status: req.body.status || 1 // Trạng thái mặc định là 1
            });

            // Kiểm tra xem vai trò có hợp lệ không
            if (![1, 2, 3].includes(newUser.role)) {
                return res.status(400).json({ message: "Invalid role" });
            }

            await db.user.create(newUser).then(addedUser => {
                res.status(201).json({
                    message: "Create successfully",
                    result: addedUser
                });
            });
        }
    } catch (error) {
        next(error);
    }
}


// Login
async function signIn(req, res, next) {
    try {
        if (!req.body.name && !req.body.email) {
            throw new createHttpError(400, "Username or email is required");
        }

        if (!req.body.password) {
            throw new createHttpError(400, "Password is required");
        }

        console.log(req.body.name);
        console.log(req.body.email);
        console.log(req.body.password);

        const existUser = await db.user.findOne({
            $or: [
                { "profile.name": req.body.name },
                { "account.email": req.body.email }
            ]
        });

        if (!existUser) {
            throw new createHttpError(404, "User not found");
        }

        const isMatch = await bcrypt.compare(req.body.password, existUser.account.password);
        if (!isMatch) {
            throw new createHttpError(401, "Invalid password");
        }

        // Tạo access token
        const token = jwt.sign({ id: existUser._id }, process.env.SECRET_KEY, {
            algorithm: process.env.ALGORITHM,
            expiresIn: parseInt(process.env.ExpIn, 10) // Chuyển đổi thành số nguyên
        });

        res.status(200).json({
            token: token,
            userInfo: {
                id: existUser._id,
                name: existUser.profile.name,
                email: existUser.account.email,
                roles: existUser.role,
            },
        });
    } catch (error) {
        next(error);
    }
}

async function signOut(req, res, next) {
    try {
        res.status(200).json({ message: 'Sign out successful' });
        console.log('Sign out successful');
    } catch (error) {
        next(error);
    }
}

const AuthController = {
    signUp,
    signIn,
    signOut
};

module.exports = AuthController;