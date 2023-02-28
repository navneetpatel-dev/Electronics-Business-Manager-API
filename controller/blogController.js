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
    validateMongoDBId(id);
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
    validateMongoDBId(id);
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
    validateMongoDBId(id);
    const deletedBlog = await Blog.findByIdAndDelete(id);
    res.status(202).json(deletedBlog);
  } catch (error) {
    next(new Error("Cannot Delete blog, something went wrong"));
  }
};

const likeBlog = async (req, res, next) => {
  try {
    const { blogId } = req.body;
    validateMongoDBId(blogId);

    // Find the blog which I want to be liked
    let blog = await Blog.findById(blogId);
    if (!blog) {
      next(new Error("Cannot find blod with this id"));
    }
    // find the login user
    const loginUserId = req?.user?._id;

    // find if the user has already liked the blog
    const isLiked = blog?.likes?.find(
      (id) => id?.toString() === loginUserId.toString()
    );

    // find if the user have already disliked the blog
    const isDisliked = blog?.dislikes?.find(
      (id) => id?.toString() === loginUserId.toString()
    );

    if (isLiked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
    } else {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
    }
    if (isDisliked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Like blog, something went wrong"));
  }
};

const dislikeBlog = async (req, res, next) => {
  try {
    const { blogId } = req.body;
    validateMongoDBId(blogId);

    // Find the blog which I want to be liked
    let blog = await Blog.findById(blogId);
    if (!blog) {
      next(new Error("Cannot find blod with this id"));
    }

    // find the login user
    const loginUserId = req?.user?._id;

    // find if the user have already disliked the blog
    const isDisliked = blog?.dislikes?.find(
      (id) => id?.toString() === loginUserId.toString()
    );

    // find if the user has already liked the blog
    const isLiked = blog?.likes?.find(
      (id) => id?.toString() === loginUserId.toString()
    );

    if (isDisliked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
    } else {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
    }
    if (isLiked) {
      blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
    }
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Dislike blog, something went wrong"));
  }
};

module.exports = {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
