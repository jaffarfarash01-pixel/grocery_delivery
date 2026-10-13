
const express = require("express");
const router = express.Router();

const { Subscription, User } = require("../models");

// Available subscription plans and their prices
const plans = {
  "Daily Essentials": 499,
  "Family Basket": 999,
  "Fresh Basket": 299,
};

// BOOK A SUBSCRIPTION
router.post("/", async (req, res) => {
  try {
    const { userId, planName, startDate } = req.body;

    if (!userId || !planName || !startDate) {
      return res.status(400).json({
        message: "User, plan, and start date are required",
      });
    }

    if (!Object.prototype.hasOwnProperty.call(plans, planName)) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    // Validate YYYY-MM-DD date format
    if (
      typeof startDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ) {
      return res.status(400).json({
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Validate the actual calendar date without timezone conversion
    const [year, month, day] = startDate.split("-").map(Number);
    const selectedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      selectedDate.getUTCFullYear() !== year ||
      selectedDate.getUTCMonth() !== month - 1 ||
      selectedDate.getUTCDate() !== day
    ) {
      return res.status(400).json({
        message: "Please enter a valid calendar date",
      });
    }

    // Compare date-only strings to avoid timezone issues
    const now = new Date();
    const today =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (startDate < today) {
      return res.status(400).json({
        message: "Please select a date that is not in the past",
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const subscription = await Subscription.create({
      userId,
      planName,
      price: plans[planName],
      startDate,
      status: "active",
    });

    return res.status(201).json({
      message: "Subscription booked successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription booking error:", error);

    return res.status(500).json({
      message: "Failed to book subscription",
    });
  }
});

// GET SUBSCRIPTIONS FOR A USER
router.get("/user/:userId", async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: {
        userId: req.params.userId,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Fetch subscriptions error:", error);

    return res.status(500).json({
      message: "Failed to fetch subscriptions",
    });
  }
});

// CANCEL A SUBSCRIPTION
router.put("/:id/cancel", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const subscription = await Subscription.findOne({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    if (subscription.status === "cancelled") {
      return res.status(400).json({
        message: "Subscription is already cancelled",
      });
    }

    subscription.status = "cancelled";
    await subscription.save();

    return res.status(200).json({
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);

    return res.status(500).json({
      message: "Failed to cancel subscription",
    });
  }
});

module.exports = router;
