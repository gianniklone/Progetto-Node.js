const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Product = sequelize.define(
  "Product",
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

// Relazioni
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

module.exports = Product;
