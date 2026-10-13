
const express = require("express");
const router = express.Router();

const { getOrCreateCart , addToCart ,
    getCart ,updateCartItem ,removeCartItem
} = require("../controllers/cartController");

// Create or retrieve a cart
router.post("/", getOrCreateCart);
router.post("/items", addToCart);
router.get("/:userId", getCart);
router.put("/:items/:itemId", updateCartItem);
router.delete("/:items/:itemId", removeCartItem);

module.exports = router;
