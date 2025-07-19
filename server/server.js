const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const configureMiddleware = require("./middleware/middleware");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/form");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database
connectDB();

// Middleware
configureMiddleware(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "Feedback Collection Platform API",
    version: "1.0.0",
    status: "running"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route not found" 
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
