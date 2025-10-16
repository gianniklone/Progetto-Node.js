const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();

const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const swapOrderRouters = require("./routes/swapOrders");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware JSON

app.use(express.json());

// CORS

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          createError.Forbidden(`Origin ${origin} non autorizzata!`),
          false
        );
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

// Rotte API

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", swapOrderRouters);

// Endpoint di test

app.get("/", (req, res) => {
  res.json({ message: "API LookBook attivata!" });
});

// Gestione 404

app.use((req, res, next) => {
  next(createError.NotFound("Endpoint non trovato"));
});

// Error Handler

app.use(errorHandler);

module.exports = app;
