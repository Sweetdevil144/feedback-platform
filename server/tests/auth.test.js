const authenticateToken = require('../middleware/auth');

// Mock the verifyToken function
jest.mock('../config/jwt', () => ({
  verifyToken: jest.fn()
}));

const { verifyToken } = require('../config/jwt');

// Mock response object for testing
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock next function
const mockNext = jest.fn();

describe('Authentication Middleware', () => {
  const mockUser = {
    _id: '60d5ecb8b5c9c62b3c7c1b5e',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and attach user to request', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid.jwt.token'
        }
      };
      const res = createMockResponse();

      verifyToken.mockResolvedValue(mockUser);

      await authenticateToken(req, res, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
      expect(req.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no authorization header is provided', async () => {
      const req = {
        headers: {}
      };
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(verifyToken).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is empty', async () => {
      const req = {
        headers: {
          authorization: ''
        }
      };
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      const req = {
        headers: {
          authorization: 'Token valid.jwt.token'
        }
      };
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid.jwt.token'
        }
      };
      const res = createMockResponse();

      verifyToken.mockResolvedValue(null);

      await authenticateToken(req, res, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('invalid.jwt.token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token verification throws error', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid.jwt.token'
        }
      };
      const res = createMockResponse();

      verifyToken.mockRejectedValue(new Error('Verification failed'));

      await authenticateToken(req, res, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid.jwt.token');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authentication failed'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle token with special characters', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlY2I4YjVjOWM2MmIzYzdjMWI1ZSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTY3ODkwfQ.invalid-signature'
        }
      };
      const res = createMockResponse();

      verifyToken.mockResolvedValue(null);

      await authenticateToken(req, res, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlY2I4YjVjOWM2MmIzYzdjMWI1ZSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTY3ODkwfQ.invalid-signature');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid or expired token'
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing headers object', async () => {
      const req = {};
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authentication failed'
      });
    });

    it('should handle null authorization header', async () => {
      const req = {
        headers: {
          authorization: null
        }
      };
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
    });

    it('should handle undefined authorization header', async () => {
      const req = {
        headers: {
          authorization: undefined
        }
      };
      const res = createMockResponse();

      await authenticateToken(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
    });
  });

  describe('User Object Attachment', () => {
    it('should attach complete user object to request', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid.jwt.token'
        }
      };
      const res = createMockResponse();

      const completeUser = {
        _id: '60d5ecb8b5c9c62b3c7c1b5e',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z'
      };

      verifyToken.mockResolvedValue(completeUser);

      await authenticateToken(req, res, mockNext);

      expect(req.user).toEqual(completeUser);
      expect(req.user).toHaveProperty('_id');
      expect(req.user).toHaveProperty('name');
      expect(req.user).toHaveProperty('email');
      expect(req.user).toHaveProperty('createdAt');
      expect(req.user).toHaveProperty('updatedAt');
    });

    it('should not modify the original user object', async () => {
      const req = {
        headers: {
          authorization: 'Bearer valid.jwt.token'
        }
      };
      const res = createMockResponse();

      const originalUser = { ...mockUser };
      verifyToken.mockResolvedValue(mockUser);

      await authenticateToken(req, res, mockNext);

      expect(req.user).toEqual(mockUser);
      expect(mockUser).toEqual(originalUser); // Original object unchanged
    });
  });
}); 