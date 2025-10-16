const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { User } = require("../models");

// Creare un utente
router.post(
  "/",
  body("nome").notEmpty().isLength({ max: 50 }),
  body("cognome").notEmpty().isLength({ max: 50 }),
  body("email").isEmail(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { nome, cognome, email } = req.body;
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser)
        return res.status(409).json({ error: "Email già registrata" });

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

// Lista utenti (con paginazione)
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({ limit, offset });
    res.json({
      total: users.count,
      page,
      pages: Math.ceil(users.count / limit),
      data: users.rows,
    });
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
