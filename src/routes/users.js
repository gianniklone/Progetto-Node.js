const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

router.post(
  "/",
  body("nome").notEmpty(),
  body("cognome").notEmpty(),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.create(req.body);
      res.status(201).json({ data: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// LEttura utente per ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Utente non trovato" });
    res.json({ data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aggiornamento di utente ID
router.put(
  "/:id",
  body("nome").notEmpty(),
  body("cognome").notEmpty(),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ errors: "Utente non trovato" });

      await user.update(req.body); // Aggiorna i campi
      res.json({ data: user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Cancellazione utente ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(400).json({ error: "Utente non trovato" });

    await user.destroy(); // Elimina l'utente dal db
    res.json({ message: "Utente eliminato correttamente!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
