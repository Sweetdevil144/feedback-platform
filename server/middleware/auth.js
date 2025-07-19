const { verifyToken } = require("../config/jwt");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    
    // Attach user to request object for use in route handlers
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authenticateToken; 