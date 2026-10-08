const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {}

  CartItem.init(
    {
      cartId: {
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