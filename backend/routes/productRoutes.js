const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  checkoutWithCard,
} = require("../controller/productControllers");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/checkout", checkoutWithCard);

module.exports = router;
