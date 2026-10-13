
const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
  updatePaymentStatus,
} = require("../controllers/orderController");

router.post("/", placeOrder);
router.get("/user/:userId", getUserOrders);

// Update order status
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);
router.get("/:id", getOrderById);
router.put("/:id/payment", updatePaymentStatus);

module.exports = router;
