const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const SwapOrder = require("./SwapOrder");

// Relazioni User → Product (1:N)
User.hasMany(Product, { foreignKey: "user_id", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "user_id" });

// Relazioni SwapOrder ↔ Product (N:M)
SwapOrder.belongsToMany(Product, {
  through: "swap_order_products",
  foreignKey: "swap_order_id",
});
Product.belongsToMany(SwapOrder, {
  through: "swap_order_products",
  foreignKey: "product_id",
});

// Relazioni SwapOrder ↔ User (N:M)
SwapOrder.belongsToMany(User, {
  through: "swap_order_users",
  foreignKey: "swap_order_id",
});
User.belongsToMany(SwapOrder, {
  through: "swap_order_users",
  foreignKey: "user_id",
});

module.exports = {
  sequelize,
  User,
  Product,
  SwapOrder,
};
