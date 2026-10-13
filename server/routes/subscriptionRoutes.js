
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

    if (!plans[planName]) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const selectedDate = new Date(`${startDate}T00:00:00`);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.toISOString().slice(0, 10) !== startDate ||
      startDate < new Date().toLocaleDateString("en-CA")
    ) {
      return res.status(400).json({
        message: "Please select a valid date that is not in the past",
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

    res.status(201).json({
      message: "Subscription booked successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription booking error:", error);

    res.status(500).json({
      message: "Failed to book subscription",
    });
  }
});

// GET SUBSCRIPTIONS FOR A USER
router.get("/user/:userId", async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { userId: req.params.userId },
      order: [["createdAt", "DESC"]],
    });

    res.json(subscriptions);
  } catch (error) {
    console.error("Fetch subscriptions error:", error);

    res.status(500).json({
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

    res.json({
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);

    res.status(500).json({
      message: "Failed to cancel subscription",
    });
  }
});

module.exports = router;
