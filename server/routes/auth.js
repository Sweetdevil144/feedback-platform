const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  deleteUser,
} = require("../controllers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);
router.get("/me/profile", authenticateToken, getProfile);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;
