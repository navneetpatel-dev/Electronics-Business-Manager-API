const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
} = require("../controller/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getAProduct);
router.get("/", getAllProducts);

module.exports = router;
