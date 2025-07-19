process.env.NODE_ENV = 'test';

// Mock console methods to prevent output during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock process.exit to prevent tests from actually exiting
global.process.exit = jest.fn();

// Setup before all tests
beforeAll(async () => {
  require('dotenv').config();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb';
});

// Cleanup after all tests
afterAll(async () => {
  // Clean up environment variables 
  delete process.env.JWT_SECRET;
  delete process.env.MONGODB_URI;
  
  // Restore console methods
  global.console = console;
});

// Global test utilities
global.createMockRequest = () => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  user: null
});

global.createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.attachment = jest.fn().mockReturnValue(res);
  return res;
};

global.mockNext = jest.fn();

// Helper function to create test users
global.createTestUser = (overrides = {}) => ({
  _id: '60d5ecb8b5c9c62b3c7c1b5e',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed-password',
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z',
  ...overrides
});

// Helper function to create test forms
global.createTestForm = (overrides = {}) => ({
  _id: '60d5ecb8b5c9c62b3c7c1b5f',
  title: 'Test Survey',
  questions: [
    {
      questionText: 'How satisfied are you?',
      type: 'multiple-choice',
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
    },
    {
      questionText: 'What could we improve?',
      type: 'text'
    },
    {
      questionText: 'Would you recommend us?',
      type: 'multiple-choice',
      options: ['Yes', 'No', 'Maybe']
    }
  ],
  createdBy: '60d5ecb8b5c9c62b3c7c1b5e',
  publicId: 'test-form-123',
  responses: [],
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z',
  ...overrides
});

// Helper function to create test responses
global.createTestResponse = (overrides = {}) => ({
  answers: [
    {
      questionIndex: 0,
      answer: 'Very Satisfied'
    },
    {
      questionIndex: 1,
      answer: 'Great service overall'
    },
    {
      questionIndex: 2,
      answer: 'Yes'
    }
  ],
  submittedAt: '2024-01-15T11:30:00.000Z',
  ...overrides
});

// Helper function to create JWT tokens for testing
global.createTestToken = (user = createTestUser()) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper function to create authorization header
global.createAuthHeader = (token) => ({
  authorization: `Bearer ${token}`
});

// Helper function to validate response structure
global.validateErrorResponse = (response, expectedStatus, expectedMessage) => {
  expect(response.status).toHaveBeenCalledWith(expectedStatus);
  expect(response.json).toHaveBeenCalledWith({
    success: false,
    error: expectedMessage
  });
};

// Helper function to validate success response structure
global.validateSuccessResponse = (response, expectedStatus, expectedData) => {
  expect(response.status).toHaveBeenCalledWith(expectedStatus);
  expect(response.json).toHaveBeenCalledWith(expectedData);
};

// Helper function to validate form structure
global.validateFormStructure = (form) => {
  expect(form).toHaveProperty('_id');
  expect(form).toHaveProperty('title');
  expect(form).toHaveProperty('questions');
  expect(form).toHaveProperty('createdBy');
  expect(form).toHaveProperty('publicId');
  expect(form).toHaveProperty('responses');
  expect(form).toHaveProperty('createdAt');
  expect(form).toHaveProperty('updatedAt');
  
  expect(Array.isArray(form.questions)).toBe(true);
  expect(form.questions.length).toBeGreaterThanOrEqual(3);
  expect(form.questions.length).toBeLessThanOrEqual(5);
  
  form.questions.forEach((question, index) => {
    expect(question).toHaveProperty('questionText');
    expect(question).toHaveProperty('type');
    expect(['text', 'multiple-choice']).toContain(question.type);
    
    if (question.type === 'multiple-choice') {
      expect(question).toHaveProperty('options');
      expect(Array.isArray(question.options)).toBe(true);
      expect(question.options.length).toBeGreaterThanOrEqual(2);
    }
  });
};

// Helper function to validate user structure
global.validateUserStructure = (user) => {
  expect(user).toHaveProperty('_id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).not.toHaveProperty('password'); // Password should be excluded
};

// Helper function to validate response structure
global.validateResponseStructure = (response) => {
  expect(response).toHaveProperty('answers');
  expect(Array.isArray(response.answers)).toBe(true);
  expect(response).toHaveProperty('submittedAt');
  
  response.answers.forEach((answer, index) => {
    expect(answer).toHaveProperty('questionIndex');
    expect(answer).toHaveProperty('answer');
    expect(typeof answer.questionIndex).toBe('number');
    expect(answer.questionIndex).toBeGreaterThanOrEqual(0);
  });
}; 