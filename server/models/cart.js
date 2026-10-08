const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {}

  Cart.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "carts",
    }
  );

  return Cart;
};