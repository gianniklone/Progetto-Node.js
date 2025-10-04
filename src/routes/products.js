const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");
const { route } = require("./users");

// Creare un prodotto
router.post(
  "/",
  body("nome").notEmpty(),
  body("foto").isArray({ min: 1 }),
  body("userId").optional().isInt({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const product = await Product.create(req.body);
      res.status(201).json({ data: product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

//Lettura prodotto per ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Prodotto non trovato" });
    res.json({ data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Aggiornare un prodotto
router.put(
  "/:id",
  body("nome").notEmpty(),
  body("foto").isArray({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: error.array() });

    try {
      const product = await Product.findByPk(req.params.id);
      if (!product)
        return res.status(404).json({ error: "Prodotto non trovato" });

      await product.update(req.body);
      res.json({ data: product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Eliminare un prodotto
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Prodotto non trovato" });

    await product.destroy();
    res.json({ message: "Prodotto eliminato correttamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
