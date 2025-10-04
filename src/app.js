const express = require("express");
const app = express();

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const swapOrderRouters = require("./routes/swapOrders");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", swapOrderRouters);
app.use(errorHandler);

// Test
app.get("/", (req, res) => {
  res.json({ message: "API LookBook attivata!" });
});

module.exports = app;
