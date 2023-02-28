const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongoDBId = require("../utils/validateMongoDBid");

const createBlog = async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(202).json(newBlog);
  } catch (error) {
    next(new Error("Cannot create new blog, something went wrong"));
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(202).json(updatedBlog);
  } catch (error) {
    next(new Error("Cannot update blog, something went wrong"));
  }
};

const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.status(200).json(getBlog);
  } catch (error) {
    next(new Error("Cannot get blog, something went wrong"));
  }
};

const getAllBlogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getBlogs = await Blog.find();
    res.status(200).json(getBlogs);
  } catch (error) {
    next(new Error("Cannot get all blogs, something went wrong"));
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.status(202).json(deletedBlog);
  } catch (error) {
    next(new Error("Cannot Delete blog, something went wrong"));
  }
};

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog };
