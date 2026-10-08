const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const User = require("./user")(sequelize, DataTypes);
const Vendor = require("./vendor")(sequelize, DataTypes);
const Category = require("./category")(sequelize, DataTypes);
const Product = require("./product")(sequelize, DataTypes);
const Cart = require("./cart")(sequelize, DataTypes);
const CartItem = require("./cartitem")(sequelize, DataTypes);

// Vendor → Products
Vendor.hasMany(Product, {
  foreignKey: "vendorId",
  as: "products",
});

Product.belongsTo(Vendor, {
  foreignKey: "vendorId",
  as: "vendor",
});

// Category → Products
Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// User → Cart
User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Cart → CartItems
Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "items",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  as: "cart",
});

// Product → CartItems
Product.hasMany(CartItem, {
  foreignKey: "productId",
  as: "cartItems",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

module.exports = {
  sequelize,
  User,
  Vendor,
  Category,
  Product,
  Cart,
  CartItem,
};