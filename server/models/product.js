const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {}

  Product.init(
    {
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product name is required",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: {
            args: [0.01],
            msg: "Price must be greater than 0",
          },
        },
      },

      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0],
            msg: "Stock cannot be negative",
          },
        },
      },

      unit: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );

  return Product;
};