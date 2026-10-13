
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {}

  Order.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: {
            args: [0],
            msg: "Total amount cannot be negative",
          },
        },
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },

      paymentStatus: {
        type: DataTypes.ENUM(
          "pending",
          "paid",
          "failed",
          "refunded"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );

  return Order;
};
