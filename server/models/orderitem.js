
"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {}

  OrderItem.init(
    {
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Quantity must be an integer",
          },
          min: {
            args: [1],
            msg: "Quantity must be at least 1",
          },
        },
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Price cannot be negative",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
    }
  );

  return OrderItem;
};
