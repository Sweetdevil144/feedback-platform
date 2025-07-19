const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
  validateObjectId
} = require("../middleware/validation");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} = require("../controllers/auth");

// Public routes (no authentication required)
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

// Protected routes (authentication required)
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, validateObjectId, getUserById);
router.get("/me/profile", authenticateToken, getProfile);
router.put("/:id", authenticateToken, validateObjectId, updateUser);
router.delete("/:id", authenticateToken, validateObjectId, deleteUser);

module.exports = router;
