const Product = require("../models/productModel");
const slugify = require("slugify");

const createProduct = async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Create Product, Something Went wrong"));
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(202).json(updatedProduct);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Update Product, Something Went wrong"));
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(202).json(deletedProduct);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Delete Product, Something Went wrong"));
  }
};

const getAProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productFetched = await Product.findById(id);
    res.json(productFetched);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Fetch Product, Something Went wrong"));
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let productsFetched = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      productsFetched = await productsFetched.sort(sortBy);
    } else {
      productsFetched = await productsFetched.sort("-createdAt");
    }

    res.json(productsFetched);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Fetch All Products, Something Went wrong"));
  }
};

module.exports = {
  createProduct,
  getAProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
