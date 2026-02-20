// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // PROTECT middleware to check if user is authenticated
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // CHECK IF USER IS ADMIN
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({
//       success: false,
//       message: "Access denied: Admins only"
//     });
//   }
// };

// // CHECK IF NORMAL USER (NOT ADMIN)
// const isUser = (req, res, next) => {
//   if (req.user && req.user.role === "user") {
//     next();
//   } else {
//     res.status(403).json({
//       success: false,
//       message: "Access denied: Users only"
//     });
//   }
// };


// module.exports = { protect, isAdmin, isUser};

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.role);
      // 🔥 Role based model selection
      if (decoded.role === "admin") {
        req.user = await Admin.findById(decoded.id).select("-password");
      } else {
        req.user = await User.findById(decoded.id).select("-password");
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
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

module.exports = { protect, isAdmin, isUser};