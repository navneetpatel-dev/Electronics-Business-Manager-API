const Product = require("../models/productModel");

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Create Product, Something Went wrong"));
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
    const productsFetched = await Product.find();
    res.json(productsFetched);
  } catch (error) {
    console.log(error);
    next(new Error("Cannot Fetch All Products, Something Went wrong"));
  }
};

module.exports = { createProduct, getAProduct, getAllProducts };
