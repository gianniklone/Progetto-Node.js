const express = require("express");
const router = express.Router();
const SwapOrder = require("../models/SwapOrder");
const Product = require("../models/Product");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Creare un ordine swap
router.post(
  "/",
  body("productIds").isArray({ min: 1 }),
  body("userIds").isArray({ min: 2 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { productIds, userIds, status, note } = req.body;
      const swapOrder = await SwapOrder.create({ status, note });

      if (productIds && productIds.length > 0) {
        const products = await Product.findAll({ where: { id: productIds } });
        await swapOrder.addProducts(products);
      }

      if (userIds && userIds.length > 1) {
        const users = await User.findAll({ where: { id: userIds } });
        await swapOrder.addUsers(users);
      }

      const result = await SwapOrder.findByPk(swapOrder.id, {
        include: [Product, User],
      });

      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

// Lettura ordine swap per ID
router.get("/:id", async (req, res, next) => {
  try {
    const swapOrder = await SwapOrder.findByPk(req.params.id, {
      include: [Product, User],
    });
    if (!swapOrder)
      return res.status(404).json({ error: "Ordine swap non trovato" });
    res.json({ data: swapOrder });
  } catch (err) {
    next(err);
  }
});

// Aggiornare un ordine swap
router.put(
  "/:id",
  body("status").optional().isIn(["pending", "completed", "cancelled"]),
  body("note").optional().isString(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const swapOrder = await SwapOrder.findByPk(req.params.id);
      if (!swapOrder)
        return res.status(404).json({ error: "Ordine swap non trovato" });

      const { status, note } = req.body;
      await swapOrder.update({ status, note });
      res.json({ data: swapOrder });
    } catch (err) {
      next(err);
    }
  }
);

// Eliminare un ordine swap
router.delete("/:id", async (req, res, next) => {
  try {
    const swapOrder = await SwapOrder.findByPk(req.params.id);
    if (!swapOrder)
      return res.status(404).json({ error: "Ordine swap non trovato" });

    await swapOrder.destroy();
    res.json({ message: "Ordine swap eliminato correttamente" });
  } catch (err) {
    next(err);
  }
});

// Filtrare ordini
router.get("/", async (req, res, next) => {
  try {
    const { productId, startDate, endDate } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const includeClause = [];
    if (productId) {
      includeClause.push({
        model: Product,
        where: { id: productId },
      });
    } else {
      includeClause.push(Product);
    }

    includeClause.push(User);

    const orders = await SwapOrder.findAll({
      where: whereClause,
      include: includeClause,
    });

    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
