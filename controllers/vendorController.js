
const { Vendor } = require("../models");

// CREATE VENDOR
exports.createVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);

    res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL VENDORS
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
