const express = require("express");
const {
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
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middelwares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.get("/login", loginUser);
router.get("/get-single-user/:id", authMiddleware, isAdmin, getSingleUser);
router.get("/get-all-users", getAllUsers);
router.put("/update-user/:id", authMiddleware, updateUser);
router.delete("/delete-user/:id", authMiddleware, deleteSingleUser);
router.post("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.post("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/password", authMiddleware, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
