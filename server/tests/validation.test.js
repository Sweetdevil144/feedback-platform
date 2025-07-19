const {
  validateRegistration,
  validateLogin,
  validateFormCreation,
  validateFormResponse,
  validateObjectId,
  validateFormId,
} = require("../middleware/validation");

// Mock response object for testing
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe("Validation Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe("validateRegistration", () => {
    it("should pass validation for valid registration data", () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = createMockResponse();

      validateRegistration(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for short name", () => {
      const req = {
        body: {
          name: "J",
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = createMockResponse();

      validateRegistration(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Name must be at least 2 characters long",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation for invalid email", () => {
      const req = {
        body: {
          name: "John Doe",
          email: "invalid-email",
          password: "password123",
        },
      };
      const res = createMockResponse();

      validateRegistration(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Valid email is required",
      });
    });

    it("should fail validation for short password", () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "123",
        },
      };
      const res = createMockResponse();

      validateRegistration(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    });

    it("should fail validation for missing fields", () => {
      const req = {
        body: {
          name: "John Doe",
          // missing email and password
        },
      };
      const res = createMockResponse();

      validateRegistration(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Valid email is required, Password must be at least 6 characters long",
      });
    });
  });

  describe("validateLogin", () => {
    it("should pass validation for valid login data", () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "password123",
        },
      };
      const res = createMockResponse();

      validateLogin(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for missing email", () => {
      const req = {
        body: {
          password: "password123",
        },
      };
      const res = createMockResponse();

      validateLogin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Email is required",
      });
    });

    it("should fail validation for missing password", () => {
      const req = {
        body: {
          email: "john@example.com",
        },
      };
      const res = createMockResponse();

      validateLogin(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Password is required",
      });
    });
  });

  describe("validateFormCreation", () => {
    it("should pass validation for valid form data", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you with our service?",
              type: "multiple-choice",
              options: ["Very Satisfied", "Satisfied", "Neutral"],
            },
            {
              questionText: "What could we improve?",
              type: "text",
            },
            {
              questionText: "Would you recommend us?",
              type: "multiple-choice",
              options: ["Yes", "No"],
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for short title", () => {
      const req = {
        body: {
          title: "Hi",
          questions: [],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Title must be at least 3 characters long, Forms must have between 3 and 5 questions",
      });
    });

    it("should fail validation for non-array questions", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: "not an array",
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Questions must be an array",
      });
    });

    it("should fail validation for too few questions", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you?",
              type: "text",
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Forms must have between 3 and 5 questions",
      });
    });

    it("should fail validation for too many questions", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            { questionText: "Q1?", type: "text" },
            { questionText: "Q2?", type: "text" },
            { questionText: "Q3?", type: "text" },
            { questionText: "Q4?", type: "text" },
            { questionText: "Q5?", type: "text" },
            { questionText: "Q6?", type: "text" },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1: Question text must be at least 5 characters long, Question 2: Question text must be at least 5 characters long, Question 3: Question text must be at least 5 characters long, Question 4: Question text must be at least 5 characters long, Question 5: Question text must be at least 5 characters long, Question 6: Question text must be at least 5 characters long",
      });
    });

    it("should fail validation for short question text", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "Hi",
              type: "text",
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1: Question text must be at least 5 characters long",
      });
    });

    it("should fail validation for invalid question type", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you?",
              type: "invalid-type",
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1: Type must be either 'text' or 'multiple-choice'",
      });
    });

    it("should fail validation for multiple-choice without options", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you?",
              type: "multiple-choice",
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1: Multiple-choice questions must have at least 2 options",
      });
    });

    it("should fail validation for multiple-choice with insufficient options", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you?",
              type: "multiple-choice",
              options: ["Only one option"],
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1: Multiple-choice questions must have at least 2 options",
      });
    });

    it("should fail validation for empty option text", () => {
      const req = {
        body: {
          title: "Customer Survey",
          questions: [
            {
              questionText: "How satisfied are you?",
              type: "multiple-choice",
              options: ["Option 1", "", "Option 3"],
            },
          ],
        },
      };
      const res = createMockResponse();

      validateFormCreation(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error:
          "Forms must have between 3 and 5 questions, Question 1, Option 2: Option text cannot be empty",
      });
    });
  });

  describe("validateFormResponse", () => {
    it("should pass validation for valid response data", () => {
      const req = {
        body: {
          answers: [
            { questionIndex: 0, answer: "Very Satisfied" },
            { questionIndex: 1, answer: "Great service" },
            { questionIndex: 2, answer: "Yes" },
          ],
        },
      };
      const res = createMockResponse();

      validateFormResponse(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for non-array answers", () => {
      const req = {
        body: {
          answers: "not an array",
        },
      };
      const res = createMockResponse();

      validateFormResponse(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Answers must be an array",
      });
    });

    it("should fail validation for invalid question index", () => {
      const req = {
        body: {
          answers: [{ questionIndex: -1, answer: "Very Satisfied" }],
        },
      };
      const res = createMockResponse();

      validateFormResponse(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Answer 1: Invalid question index",
      });
    });

    it("should fail validation for empty answer", () => {
      const req = {
        body: {
          answers: [{ questionIndex: 0, answer: "" }],
        },
      };
      const res = createMockResponse();

      validateFormResponse(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Answer 1: Answer cannot be empty",
      });
    });

    it("should fail validation for null answer", () => {
      const req = {
        body: {
          answers: [{ questionIndex: 0, answer: null }],
        },
      };
      const res = createMockResponse();

      validateFormResponse(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Answer 1: Answer cannot be empty",
      });
    });
  });

  describe("validateObjectId", () => {
    it("should pass validation for valid ObjectId", () => {
      const req = {
        params: { id: "60d5ecb8b5c9c62b3c7c1b5e" },
      };
      const res = createMockResponse();

      validateObjectId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for invalid ObjectId format", () => {
      const req = {
        params: { id: "invalid-id" },
      };
      const res = createMockResponse();

      validateObjectId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid ID format",
      });
    });

    it("should fail validation for missing ID", () => {
      const req = {
        params: {},
      };
      const res = createMockResponse();

      validateObjectId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid ID format",
      });
    });
  });

  describe("validateFormId", () => {
    it("should pass validation for valid form ID", () => {
      const req = {
        params: { formId: "abc123-def456-ghi789" },
      };
      const res = createMockResponse();

      validateFormId(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail validation for empty form ID", () => {
      const req = {
        params: { formId: "" },
      };
      const res = createMockResponse();

      validateFormId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Form ID is required",
      });
    });

    it("should fail validation for missing form ID", () => {
      const req = {
        params: {},
      };
      const res = createMockResponse();

      validateFormId(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: "Form ID is required",
      });
    });
  });
});
