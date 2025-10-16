const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { Product, User } = require("../models");
// Creazione prodotto
router.post(
  "/",
  body("nome").notEmpty().isLength({ max: 255 }),
  body("foto").isArray({ min: 1 }),
  body("user_id").isInt({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { nome, foto, user_id } = req.body;
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ error: "Utente non trovato" });

      const existingProduct = await Product.findOne({
        where: { nome, user_id },
      });
      if (existingProduct)
        return res
          .status(409)
          .json({ error: "Prodotto già registrato per questo utente" });

      const product = await Product.create({ nome, foto, user_id });
      res.status(201).json({ data: product });
    } catch (err) {
      next(err);
    }
  }
);

// Lettura prodotto per ID
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Prodotto non trovato" });
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});
// Lista prodotti con paginazione
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({ limit, offset });
    res.json({
      total: products.count,
      page,
      pages: Math.ceil(products.count / limit),
      data: products.rows,
    });
  } catch (err) {
    next(err);
  }
});

// Aggiornare un prodotto
router.put(
  "/:id",
  body("nome").notEmpty(),
  body("foto").isArray({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const product = await Product.findByPk(req.params.id);
      if (!product)
        return res.status(404).json({ error: "Prodotto non trovato" });

      const { nome, foto, userId } = req.body;
      await product.update({ nome, foto, userId });
      res.json({ data: product });
    } catch (err) {
      next(err);
    }
  }
);

// Eliminare un prodotto
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Prodotto non trovato" });

    await product.destroy();
    res.json({ message: "Prodotto eliminato correttamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
