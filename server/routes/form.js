const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const {
  validateFormCreation,
  validateFormResponse,
  validateFormId
} = require("../middleware/validation");

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
router.post("/", authenticateToken, validateFormCreation, createForm);
router.get("/", authenticateToken, getAllForms);
router.get("/:formId/responses", authenticateToken, validateFormId, getFormResponses);
router.get("/:formId/export", authenticateToken, validateFormId, exportFormResponses);

// Public routes (no authentication required)
router.get("/:formId", validateFormId, getFormById);
router.post("/:formId/responses", validateFormId, validateFormResponse, submitFormResponse);
router.get("/:formId/summary", validateFormId, getFormSummary);

module.exports = router;
