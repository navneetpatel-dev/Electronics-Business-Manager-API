const express = require("express");
const router = express.Router();

const {
  createBlog,
  updateBlog,
  getBlog,
} = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middelwares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", authMiddleware, isAdmin, getBlog);

module.exports = router;
