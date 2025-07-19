const jwt = require("jsonwebtoken");
const User = require("../models/User");

function getJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }
  return JWT_SECRET;
}

function generateToken(user) {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, getJWTSecret(), { expiresIn: "7d" });
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, getJWTSecret());
    const user = await User.getUserById(decoded.id);
    return user;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
