const express = require("express");
const router = express.Router();
const SwapOrder = require("../models/SwapOrder");
const Product = require("../models/Product");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");

// POST: Creazione nuovo ordine swap
router.post(
  "/",
  body("productIds").isArray({ min: 1 }),
  body("userIds").isArray({ min: 2 }), // almeno due utenti partecipanti
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { productIds, userIds } = req.body;

      // Controllo che tutti i prodotti esistano
      const products = await Product.findAll({ where: { id: productIds } });
      if (products.length !== productIds.length)
        return res
          .status(400)
          .json({ error: "Alcuni productIds non esistono" });

      // Controllo che tutti gli utenti esistano
      const users = await User.findAll({ where: { id: userIds } });
      if (users.length !== userIds.length)
        return res.status(400).json({ error: "Alcuni userIds non esistono" });

      // Creazione ordine swap
      const swapOrder = await SwapOrder.create();

      // Associa prodotti e utenti all'ordine
      await swapOrder.addProducts(products);
      await swapOrder.addUsers(users);

      // Ricarica ordine con relazioni
      const orderWithRelations = await SwapOrder.findByPk(swapOrder.id, {
        include: [Product, User],
      });

      res.status(201).json({ data: orderWithRelations });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET: Leggere un ordine per ID

router.get("/:id", async (req, res) => {
  try {
    const order = await SwapOrder.findByPk(req.params.id, {
      include: [Product, User],
    });
    if (!order) return res.status(404).json({ error: "Ordine non trovato" });
    res.json({ data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Ottenere tutti gli ordini con filtri

router.get("/", async (req, res) => {
  const { date, productId } = req.query;

  try {
    const whereClause = {};
    const includeClause = [];

    // Controllo della data
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ error: "Data non valida. Usa formato YYYY-MM-DD" });
      }

      whereClause.createdAt = {
        [Op.gte]: parsedDate,
        [Op.lt]: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    // Filtro per prodotto
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

    if (orders.length === 0) {
      return res.json({
        data: [],
        message: "Nessun ordine trovato per i filtri specificati",
      });
    }

    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Aggiornare un ordine

router.put(
  "/:id",
  body("productIds").optional().isArray({ min: 1 }),
  body("userIds").optional().isArray({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const order = await SwapOrder.findByPk(req.params.id);
      if (!order) return res.status(404).json({ error: "Ordine non trovato" });

      const { productIds, userIds } = req.body;

      // Aggiorna prodotti se presenti
      if (productIds) {
        const products = await Product.findAll({ where: { id: productIds } });
        if (products.length !== productIds.length)
          return res
            .status(400)
            .json({ error: "Alcuni productIds non esistono" });
        await order.setProducts(products);
      }

      // Aggiorna utenti se presenti
      if (userIds) {
        const users = await User.findAll({ where: { id: userIds } });
        if (users.length !== userIds.length)
          return res.status(400).json({ error: "Alcuni userIds non esistono" });
        await order.setUsers(users);
      }

      // Ricarica ordine con relazioni
      const updatedOrder = await SwapOrder.findByPk(order.id, {
        include: [Product, User],
      });
      res.json({ data: updatedOrder });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE: Eliminare un ordine

router.delete("/:id", async (req, res) => {
  try {
    const order = await SwapOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Ordine non trovato" });

    await order.destroy();
    res.json({ message: "Ordine eliminato correttamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
