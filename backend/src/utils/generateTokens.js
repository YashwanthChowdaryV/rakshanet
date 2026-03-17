const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,   // 👈 THIS is where JWT_SECRET is used
        { expiresIn: "7d" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },
        process.env.JWT_REFRESH_SECRET,  // 👈 THIS uses refresh secret
        { expiresIn: "7d" }
    );
};

module.exports = { generateAccessToken, generateRefreshToken };