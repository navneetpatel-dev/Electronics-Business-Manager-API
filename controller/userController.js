const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDBId = require("../utils/validateMongoDBid");
const { generateRefreshToken } = require("../config/refreshToken");
const { generateToken } = require("../config/jwtToken");

const createUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      // create a new user
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      // user already exist
      res.status(404);
      next(new Error("User Already Exists"));
    }
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Create User, Something Went Wrong"));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //   does use exit or not
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(404);
      next(new Error("Email Does not Exist"));
    } else {
      const passwordMatched = await userExist.isPasswordMatched(password);
      const refreshToken = generateRefreshToken(userExist._id);
      const updateUser = await User.findByIdAndUpdate(
        userExist._id,
        { refreshToken },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      userExist.toJson();
      if (passwordMatched) {
        res.status(200).json(userExist);
      } else {
        res.status(404);
        next(new Error("Invalid Password"));
      }
    }
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Login, Something Went Wrong"));
  }
};

// handle refresh token

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      res.status(404);
      next(new Error("No refresh token in coockies"));
    }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({ refreshToken }).select("-password");
    if (!user) {
      res.status(404);
      next(new Error("No refresh token is present in DB"));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (user._id.toHexString() !== decoded.id) {
      res.status(404);
      next("Cannot Verify User, Something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    next(new Error("Cannot access Refresh Token, Something went wrong"));
  }
};

// logout functionality

const logout = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      res.status(404);
      next(new Error("No refresh token in coockies"));
    }
    const refreshToken = cookie?.refreshToken;
    const user = await User.findOne({ refreshToken }).select("-password");
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); //Forbidden
    }
    await User.findOneAndUpdate(
      refreshToken,
      {
        refreshToken: "",
      },
      { new: true }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //Forbidden
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Logout User, Something went wrong"));
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMongoDBId(id);
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      next(new Error("User Not Found"));
    } else {
      res.status(202).json(user);
    }
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Fetch User, Something Went Wrong"));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Fetch Users, Something Went Wrong"));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.user?._id;
    validateMongoDBId(id);
    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(404);
      next(new Error("User Not Found"));
    }
    const updatedUser = await User.findByIdAndUpdate(userExist._id, req.body, {
      new: true,
    }).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Update User, Something Went Wrong"));
  }
};

const deleteSingleUser = async (req, res, next) => {
  try {
    const id = req.user?._id;
    validateMongoDBId(id);
    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(404);
      next(new Error("User Not Found"));
    }
    const deletedUser = await User.findByIdAndDelete(id).select("-password");
    res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Delete User, Something Went Wrong"));
  }
};

const blockUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    validateMongoDBId(id);
    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(404);
      next(new Error("User Not Found"));
    }
    const blockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "User Blocked" });
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Block User, Something Went Wrong"));
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    validateMongoDBId(id);
    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(404);
      next(new Error("User Not Found"));
    }
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "User Unblocked" });
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Unblock User, Something Went Wrong"));
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
};
