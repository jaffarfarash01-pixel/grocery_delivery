
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {}

  CartItem.init(
    {
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Cart ID must be an integer",
          },
          min: {
            args: [1],
            msg: "Cart ID must be positive",
          },
        },
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Product ID must be an integer",
          },
          min: {
            args: [1],
            msg: "Product ID must be positive",
          },
        },
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
    }
  );

  return CartItem;
};
