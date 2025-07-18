const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} = require("../controllers/auth");

// Register a new user (admin)
router.post("/register", registerUser);

// Login user (admin)
router.post("/login", loginUser);

// Get all users (admin only, for demonstration)
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

// Get current user's profile using JWT token
router.get("/me/profile", getProfile);

// Update user by ID
router.put("/:id", updateUser);

// Delete user by ID
router.delete("/:id", deleteUser);

module.exports = router;
