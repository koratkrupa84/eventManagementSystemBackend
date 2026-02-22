const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Organizer = require("../models/Organizer");

const protect = async (req, res, next) => {
  let token;

  console.log("=== AUTH DEBUG START ===");
  console.log("Headers:", req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token extracted:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
      console.log("Token decoded successfully:", decoded);
      
      // 🔥 Role based model selection
      if (decoded.role === "admin") {
        console.log("Looking for admin with ID:", decoded.id);
        req.user = await Admin.findById(decoded.id).select("-password");
        console.log("Admin user found:", req.user);
      } else if (decoded.role === "organizer") {
        console.log("Looking for organizer with ID:", decoded.id);
        req.user = await Organizer.findById(decoded.id).select("-password");
        console.log("Organizer user found:", req.user);
      } else {
        console.log("Looking for user with ID:", decoded.id);
        req.user = await User.findById(decoded.id).select("-password");
        console.log("Regular user found:", req.user);
      }

      if (!req.user) {
        console.log("ERROR: User not found in database");
        return res.status(401).json({ message: "User not found" });
      }

      console.log("Authentication successful, proceeding to next()");
      next();
    } catch (error) {
      console.log("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("ERROR: No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ message: "Admins only" });
  }
};

const isUser = (req, res, next) => {
  // Allow client or organizer (non-admin users)
  if (req.user && (req.user.role === "client" || req.user.role === "organizer")) {
    next();
  } else {
    res.status(403).json({ message: "Users only" });
  }
};

module.exports = { protect, isAdmin, isUser };