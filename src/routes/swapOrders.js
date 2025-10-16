const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { SwapOrder, User, Product } = require("../models");

// Creare un ordine swap
router.post(
  "/",
  body("userIds").isArray({ min: 2 }),
  body("productIds").isArray({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { userIds, productIds, status, note } = req.body;

      // Verifica utenti esistenti
      const users = await User.findAll({ where: { id: userIds } });
      if (users.length !== userIds.length)
        return res.status(404).json({ error: "Uno o più utenti non trovati" });

      // Verifica prodotti esistenti
      const products = await Product.findAll({ where: { id: productIds } });
      if (products.length !== productIds.length)
        return res
          .status(404)
          .json({ error: "Uno o più prodotti non trovati" });

      const swapOrder = await SwapOrder.create({ status, note });
      await swapOrder.setUsers(users);
      await swapOrder.setProducts(products);

      res.status(201).json({ data: swapOrder });
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

// Lista swap orders con filtro e paginazione
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const where = status ? { status } : undefined;

    const swapOrders = await SwapOrder.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [User, Product],
    });

    res.json({
      total: swapOrders.count,
      page: parseInt(page),
      pages: Math.ceil(swapOrders.count / limit),
      data: swapOrders.rows,
    });
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
