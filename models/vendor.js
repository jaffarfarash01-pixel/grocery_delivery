const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {}

  Vendor.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Vendor name is required",
          },
        },
      },

      contactEmail: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Please provide a valid email",
          },
        },
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Vendor",
      tableName: "vendors",
    }
  );

  return Vendor;
};