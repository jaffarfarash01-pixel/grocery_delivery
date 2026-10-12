
const express = require("express");
const router = express.Router();

const {
  createVendor,
  getAllVendors,
} = require("../controllers/vendorController");

router.post("/", createVendor);
router.get("/", getAllVendors);

module.exports = router;
