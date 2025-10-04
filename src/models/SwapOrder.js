const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const SwapOrder = sequelize.define(
  "SwapOrder",
  {},
  {
    tableName: "swap_orders",
    timestamps: true,
  }
);
// Relazioni con Product
SwapOrder.belongsToMany(Product, {
  through: "SwapOrderProducts",
  foreignKey: "swapOrderId",
});
Product.belongsToMany(SwapOrder, {
  through: "SwapOrderProducts",
  foreignKey: "productId",
});

// Relazioni con User
SwapOrder.belongsToMany(User, {
  through: "SwapOrderUsers",
  foreignKey: "swapOrderId",
});
User.belongsToMany(SwapOrder, {
  through: "SwapOrderUsers",
  foreignKey: "userId",
});

module.exports = SwapOrder;
