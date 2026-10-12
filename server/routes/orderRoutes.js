
const express = require("express");
const router = express.Router();

const { placeOrder } = require("../controllers/orderController");

// Place an order from the customer's cart
router.post("/", placeOrder);

module.exports = router;
