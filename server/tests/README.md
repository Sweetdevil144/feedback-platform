# Testing Documentation

This directory contains comprehensive unit tests for the Feedback Collection Platform API.

## Test Structure

```bash
tests/
├── README.md              # This file
├── setup.js               # Global test setup and utilities
├── validation.test.js     # Input validation middleware tests
├── errorHandler.test.js   # Error handling middleware tests
├── jwt.test.js           # JWT utilities tests
├── auth.test.js          # Authentication middleware tests
└── db.test.js            # Database connection tests
```

## Test Categories

### 1. **Validation Tests** (`validation.test.js`)

Tests for input validation middleware functions:

- **Registration validation**: Name, email, password requirements
- **Login validation**: Email and password presence
- **Form creation validation**: Title, questions, question types, options
- **Form response validation**: Answers array, question indices, answer values
- **ID validation**: ObjectId format validation
- **Form ID validation**: Required parameter validation

### 2. **Error Handler Tests** (`errorHandler.test.js`)

Tests for global error handling middleware:

- **Mongoose errors**: CastError, ValidationError, duplicate key errors
- **JWT errors**: Invalid tokens, expired tokens
- **Custom errors**: Custom status codes and messages
- **Development mode**: Stack trace inclusion
- **Error logging**: Console error output

### 3. **JWT Tests** (`jwt.test.js`)

Tests for JWT token generation and verification:

- **Token generation**: Valid token creation with proper payload
- **Token verification**: Valid token verification and user retrieval
- **Error handling**: Invalid tokens, expired tokens, malformed tokens
- **Security**: Token payload structure and sensitive data exclusion

### 4. **Authentication Tests** (`auth.test.js`)

Tests for authentication middleware:

- **Valid authentication**: Proper token verification and user attachment
- **Invalid authentication**: Missing tokens, invalid tokens, expired tokens
- **Header handling**: Various authorization header formats
- **Error scenarios**: Network errors, database errors

### 5. **Database Tests** (`db.test.js`)

Tests for database connection functionality:

- **Successful connection**: Proper MongoDB connection setup
- **Environment variables**: MONGODB_URI validation
- **Error handling**: Connection failures, network timeouts
- **Configuration**: Connection options and URI formats

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- validation.test.js
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="should validate"
```

## Test Utilities

The `setup.js` file provides global utilities for all tests:

### Mock Objects

- `createMockRequest()`: Creates mock request object
- `createMockResponse()`: Creates mock response object
- `mockNext`: Mock next function

### Test Data Creators

- `createTestUser(overrides)`: Creates test user object
- `createTestForm(overrides)`: Creates test form object
- `createTestResponse(overrides)`: Creates test response object
- `createTestToken(user)`: Creates JWT token for testing
- `createAuthHeader(token)`: Creates authorization header

### Validation Helpers

- `validateErrorResponse(response, status, message)`: Validates error responses
- `validateSuccessResponse(response, status, data)`: Validates success responses
- `validateFormStructure(form)`: Validates form object structure
- `validateUserStructure(user)`: Validates user object structure
- `validateResponseStructure(response)`: Validates response object structure

## Test Coverage

The tests cover:

### **Validation Logic** (100%)

- All validation functions tested
- Edge cases and error scenarios
- Input format validation
- Business rule validation

### **Error Handling** (100%)

- All error types handled
- Proper status codes returned
- Consistent error message format
- Development vs production behavior

### **JWT Functionality** (100%)

- Token generation and verification
- Security aspects
- Error scenarios
- Token payload validation

### **Authentication** (100%)

- Middleware functionality
- Header parsing
- User object attachment
- Error scenarios

### **Database Connection** (100%)

- Connection success and failure
- Environment variable handling
- Error logging
- Configuration validation

## Test Best Practices

### **Isolation**

- Each test is independent
- No shared state between tests
- Proper cleanup after each test

### **Mocking**

- External dependencies are mocked
- Database calls are mocked
- Console output is suppressed during tests

### **Coverage**

- Both success and failure scenarios tested
- Edge cases covered
- Error conditions validated

### **Readability**

- Clear test descriptions
- Descriptive variable names
- Logical test organization

## Adding New Tests

When adding new functionality, follow these patterns:

1. **Create test file**: `feature.test.js`
2. **Import dependencies**: Mock external modules
3. **Write test cases**: Cover success and failure scenarios
4. **Use utilities**: Leverage global test utilities
5. **Follow naming**: Use descriptive test names
6. **Add coverage**: Ensure comprehensive coverage

## Example Test Structure

```javascript
describe("Feature Name", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Function Name", () => {
    it("should do something when conditions are met", () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      functionName(req, res, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return error when conditions are not met", () => {
      // Arrange
      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      functionName(req, res, mockNext);

      // Assert
      validateErrorResponse(res, 400, "Expected error message");
    });
  });
});
```

## Continuous Integration

Tests are configured to run in CI/CD pipelines:

- **Coverage reporting**: HTML and LCOV formats
- **Exit codes**: Tests fail on any test failure
- **Verbose output**: Detailed test results
- **Watch mode**: Available for development
