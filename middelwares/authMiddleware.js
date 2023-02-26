const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        res.status(404);
        next(new Error("Token Expired, Please Login Again"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded?.id).select("-password");
      req.user = user;
      next();
    } else {
      res.status(404);
      next(new Error("There is No Token attached to Header"));
    }
  } catch (error) {
    console.log(error);
    res.status(404);
    next(new Error("No Token Present, Something Went Wrong"));
  }
};

const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role !== "admin") {
    res.status(404);
    next(new Error("You are not an Admin"));
  } else {
    next();
  }
};

module.exports = { authMiddleware, isAdmin };
