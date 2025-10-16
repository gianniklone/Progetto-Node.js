const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Creare un utente
router.post(
  "/",
  body("nome").notEmpty(),
  body("cognome").notEmpty(),
  body("email").isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { nome, cognome, email } = req.body;
      const user = await User.create({ nome, cognome, email });
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  }
);

// Leggere un utente per ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utente non trovato" });
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// Aggiornare un utente
router.put(
  "/:id",
  body("nome").optional().notEmpty(),
  body("cognome").optional().notEmpty(),
  body("email").optional().isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Utente non trovato" });

      const { nome, cognome, email } = req.body;
      await user.update({ nome, cognome, email });
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  }
);

// Eliminare un utente
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utente non trovato" });

    await user.destroy();
    res.json({ message: "Utente eliminato correttamente" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
