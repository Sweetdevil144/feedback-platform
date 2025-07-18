const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const { Schema } = mongoose;

// Schema for individual questions in a form
const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["text", "multiple-choice"],
    required: true,
  },
  options: [
    {
      type: String,
      trim: true,
    },
  ],
});

// Schema for individual responses to a form
const responseSchema = new Schema(
  {
    answers: [
      {
        questionIndex: { type: Number, required: true },
        answer: { type: Schema.Types.Mixed, required: true },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const formSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length >= 3 && arr.length <= 5,
        message: "Forms must have between 3 and 5 questions.",
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publicId: {
      type: String,
      unique: true,
      default: uuidv4,
    },
    responses: [responseSchema], // Embedded responses for this form
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);
