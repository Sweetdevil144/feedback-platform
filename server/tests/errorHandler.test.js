const errorHandler = require('../middleware/errorHandler');

// Mock response object for testing
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock request object
const createMockRequest = () => {
  return {};
};

// Mock next function
const mockNext = jest.fn();

describe('Error Handler Middleware', () => {
  let req, res;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('Mongoose CastError', () => {
    it('should handle CastError and return 404', () => {
      const err = new Error('Cast to ObjectId failed');
      err.name = 'CastError';

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Resource not found'
      });
    });
  });

  describe('Mongoose Duplicate Key Error', () => {
    it('should handle duplicate key error and return 400', () => {
      const err = new Error('Duplicate field value');
      err.code = 11000;

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Duplicate field value entered'
      });
    });
  });

  describe('Mongoose Validation Error', () => {
    it('should handle validation error and return 400', () => {
      const err = new Error('Validation failed');
      err.name = 'ValidationError';
      err.errors = {
        email: { message: 'Email is required' },
        password: { message: 'Password is required' }
      };

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email is required, Password is required'
      });
    });

    it('should handle validation error with single field', () => {
      const err = new Error('Validation failed');
      err.name = 'ValidationError';
      err.errors = {
        email: { message: 'Email is required' }
      };

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email is required'
      });
    });
  });

  describe('JWT Errors', () => {
    it('should handle JsonWebTokenError and return 401', () => {
      const err = new Error('Invalid token');
      err.name = 'JsonWebTokenError';

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token'
      });
    });

    it('should handle TokenExpiredError and return 401', () => {
      const err = new Error('Token expired');
      err.name = 'TokenExpiredError';

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token expired'
      });
    });
  });

  describe('Custom Error with Status Code', () => {
    it('should handle custom error with statusCode', () => {
      const err = new Error('Custom error message');
      err.statusCode = 403;

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Custom error message'
      });
    });
  });

  describe('Default Error Handling', () => {
    it('should handle generic error and return 500', () => {
      const err = new Error('Generic server error');

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Generic server error'
      });
    });

    it('should handle error without message and return default message', () => {
      const err = new Error();

      errorHandler(err, req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Server Error'
      });
    });
  });

  describe('Development Mode Stack Trace', () => {
    it('should include stack trace in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const err = new Error('Test error');
      err.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(err, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error',
        stack: 'Error: Test error\n    at test.js:1:1'
      });

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should not include stack trace in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const err = new Error('Test error');
      err.stack = 'Error: Test error\n    at test.js:1:1';

      errorHandler(err, req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error'
      });

      // Restore original environment
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Logging', () => {
    it('should log errors to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const err = new Error('Test error');

      errorHandler(err, req, res, mockNext);

      expect(consoleSpy).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });
}); 