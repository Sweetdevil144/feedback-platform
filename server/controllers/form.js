const Form = require("../models/Form");
const { verifyToken } = require("../config/jwt");

// Create a new feedback form (protected)
const createForm = async (req, res) => {
  try {
    // Auth: Bearer token in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { title, questions } = req.body;
    if (!title || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Title and questions are required" });
    }
    if (questions.length < 3 || questions.length > 5) {
      return res.status(400).json({ message: "Forms must have between 3 and 5 questions." });
    }
    // Validate each question
    for (const q of questions) {
      if (
        !q.questionText ||
        !q.type ||
        (q.type === "multiple-choice" && (!Array.isArray(q.options) || q.options.length < 2))
      ) {
        return res.status(400).json({ message: "Invalid question format" });
      }
    }

    const form = await Form.create({
      title,
      questions,
      createdBy: user._id,
    });

    res.status(201).json({ form });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// List all forms (protected)
const getAllForms = async (req, res) => {
  try {
    // Auth: Bearer token in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Only return forms created by this user
    const forms = await Form.find({ createdBy: user._id }).select("-responses");
    res.status(200).json({ forms });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get form details and responses summary (public)
const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findOne({ publicId: formId }).lean();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Prepare summary: number of responses, question stats (optional)
    const summary = {
      id: form.publicId,
      title: form.title,
      questions: form.questions,
      responsesCount: form.responses ? form.responses.length : 0,
    };
    res.status(200).json({ form: summary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Submit a response (public)
const submitFormResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }
    const form = await Form.findOne({ publicId: formId });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Validate answers: must match questions length and indices
    if (answers.length !== form.questions.length) {
      return res.status(400).json({ message: "All questions must be answered" });
    }
    for (let i = 0; i < answers.length; i++) {
      const q = form.questions[i];
      const a = answers[i];
      if (a.questionIndex !== i) {
        return res.status(400).json({ message: "Invalid answer format" });
      }
      if (q.type === "multiple-choice") {
        if (!q.options.includes(a.answer)) {
          return res.status(400).json({ message: "Invalid answer for multiple-choice question" });
        }
      }
      // For text, any string is allowed
    }
    form.responses.push({ answers });
    await form.save();
    res.status(201).json({ message: "Response submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all raw responses (protected)
const getFormResponses = async (req, res) => {
  try {
    // Auth: Bearer token in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { formId } = req.params;
    const form = await Form.findOne({ publicId: formId });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    // Only allow owner to view responses
    if (form.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view responses for this form" });
    }
    res.status(200).json({ responses: form.responses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createForm,
  getAllForms,
  getFormById,
  submitFormResponse,
  getFormResponses,
};
