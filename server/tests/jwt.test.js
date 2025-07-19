process.env.JWT_SECRET = 'test-secret-key';

const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../config/jwt');

jest.mock('../models/User', () => ({
  getUserById: jest.fn()
}));

const User = require('../models/User');

describe('JWT Utilities', () => {
  const mockUser = {
    _id: '60d5ecb8b5c9c62b3c7c1b5e',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include user data in token payload', () => {
      const token = generateToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.id).toBe(mockUser._id);
      expect(decoded.name).toBe(mockUser.name);
      expect(decoded.email).toBe(mockUser.email);
    });

    it('should set token expiration to 7 days', () => {
      const token = generateToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const now = Math.floor(Date.now() / 1000);
      const expectedExp = now + (7 * 24 * 60 * 60); // 7 days in seconds

      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(expectedExp);
    });

    it('should throw error when JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        require('../config/jwt');
      }).toThrow('JWT_SECRET not set in environment variables');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return user', async () => {
      const token = generateToken(mockUser);
      User.getUserById.mockResolvedValue(mockUser);

      const result = await verifyToken(token);

      expect(result).toEqual(mockUser);
      expect(User.getUserById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return null for invalid token', async () => {
      const invalidToken = 'invalid.token.here';

      const result = await verifyToken(invalidToken);

      expect(result).toBeNull();
      expect(User.getUserById).not.toHaveBeenCalled();
    });

    it('should return null for expired token', async () => {
      // Create a token that expires immediately
      const expiredToken = jwt.sign(
        { id: mockUser._id, name: mockUser.name, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Wait a bit to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await verifyToken(expiredToken);

      expect(result).toBeNull();
      expect(User.getUserById).not.toHaveBeenCalled();
    });

    it('should return null when user not found in database', async () => {
      const token = generateToken(mockUser);
      User.getUserById.mockResolvedValue(null);

      const result = await verifyToken(token);

      expect(result).toBeNull();
      expect(User.getUserById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return null when database query throws error', async () => {
      const token = generateToken(mockUser);
      User.getUserById.mockRejectedValue(new Error('Database error'));

      const result = await verifyToken(token);

      expect(result).toBeNull();
      expect(User.getUserById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should handle malformed token', async () => {
      const malformedToken = 'not.a.valid.jwt.token';

      const result = await verifyToken(malformedToken);

      expect(result).toBeNull();
    });

    it('should handle token with wrong signature', async () => {
      const wrongSignatureToken = jwt.sign(
        { id: mockUser._id, name: mockUser.name, email: mockUser.email },
        'wrong-secret',
        { expiresIn: '7d' }
      );

      const result = await verifyToken(wrongSignatureToken);

      expect(result).toBeNull();
    });
  });

  describe('Token Payload Structure', () => {
    it('should include all required fields in token payload', () => {
      const token = generateToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('name');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('iat'); // issued at
      expect(decoded).toHaveProperty('exp'); // expiration
    });

    it('should not include sensitive information in token', () => {
      const userWithPassword = {
        ...mockUser,
        password: 'hashed-password'
      };

      const token = generateToken(userWithPassword);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded).not.toHaveProperty('password');
    });
  });

  describe('Error Handling', () => {
    it('should handle JWT verification errors gracefully', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZDVlY2I4YjVjOWM2MmIzYzdjMWI1ZSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NTY3ODkwfQ.invalid-signature';

      const result = await verifyToken(invalidToken);

      expect(result).toBeNull();
    });

    it('should handle tokens with missing required fields', async () => {
      const incompleteToken = jwt.sign(
        { id: mockUser._id }, // Missing name and email
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const result = await verifyToken(incompleteToken);

      expect(result).toBeNull();
    });
  });
}); 