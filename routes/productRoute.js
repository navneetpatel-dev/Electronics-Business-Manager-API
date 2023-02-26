const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateProduct,
} = require("../controller/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getAProduct);
router.get("/", getAllProducts);
router.put("/:id", updateProduct);

module.exports = router;
