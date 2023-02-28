const express = require("express");
const router = express.Router();

const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
} = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middelwares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", authMiddleware, isAdmin, getBlog);
router.get("/", authMiddleware, isAdmin, getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
