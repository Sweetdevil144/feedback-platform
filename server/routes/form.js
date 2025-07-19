const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

const {
  createForm,
  getAllForms,
  getFormById,
  submitFormResponse,
  getFormResponses,
  getFormSummary,
  exportFormResponses,
} = require("../controllers/form");

// Protected routes (authentication required)
router.post("/", authenticateToken, createForm);
router.get("/", authenticateToken, getAllForms);
router.get("/:formId/responses", authenticateToken, getFormResponses);
router.get("/:formId/export", authenticateToken, exportFormResponses);

// Public routes (no authentication required)
router.get("/:formId", getFormById);
router.post("/:formId/responses", submitFormResponse);
router.get("/:formId/summary", getFormSummary);

module.exports = router;
