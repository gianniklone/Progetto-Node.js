const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");

// Creare un prodotto
router.post(
  "/",
  body("nome").notEmpty(),
  body("foto").isArray({ min: 1 }),
  body("userId").optional().isInt({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { nome, foto, userId } = req.body;
      const product = await Product.create({ nome, foto, userId });
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
