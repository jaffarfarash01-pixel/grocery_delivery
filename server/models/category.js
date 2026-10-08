const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {}

  Category.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Category name is required",
          },
        },
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
    }
  );

  return Category;
};