
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("Subscription", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    planName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "cancelled"),
      defaultValue: "active",
      allowNull: false,
    },
  });

  return Subscription;
};
