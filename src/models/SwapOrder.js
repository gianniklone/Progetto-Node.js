const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SwapOrder = sequelize.define(
  "SwapOrder",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "swap_orders",
    timestamps: true,
    underscored: true,
  }
);

module.exports = SwapOrder;
