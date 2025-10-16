const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    foto: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Product;
