const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Mock mongoose
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
}));

describe("Database Connection", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("connectDB", () => {
    it("should connect to MongoDB successfully", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      mongoose.connect.mockResolvedValue();

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/test"
      );
    });

    it("should log success message on successful connection", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      mongoose.connect.mockResolvedValue();

      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      await connectDB();

      expect(consoleSpy).toHaveBeenCalledWith("MongoDB connected successfully");

      consoleSpy.mockRestore();
    });

    it("should use correct connection options", async () => {
      process.env.MONGODB_URI = "mongodb://localhost:27017/test";
      mongoose.connect.mockResolvedValue();

      await connectDB();

      expect(mongoose.connect).toHaveBeenCalledWith(
        "mongodb://localhost:27017/test"
      );
    });

    it("should handle different MongoDB URI formats", async () => {
      const testUris = [
        "mongodb://localhost:27017/test",
        "mongodb+srv://user:pass@cluster.mongodb.net/test",
        "mongodb://user:pass@localhost:27017/test?authSource=admin",
      ];

      for (const uri of testUris) {
        process.env.MONGODB_URI = uri;
        mongoose.connect.mockResolvedValue();

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(uri);

        jest.clearAllMocks();
      }
    });
  });

  describe("Environment Variables", () => {
    it("should handle missing environment variables gracefully", () => {
      const originalEnv = process.env;
      process.env = {};

      expect(() => {
        require("../config/db");
      }).not.toThrow();
    });

    it("should handle undefined environment variables", () => {
      process.env.MONGODB_URI = undefined;

      expect(() => {
        require("../config/db");
      }).not.toThrow();
    });
  });
});
