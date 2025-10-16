module.exports = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) console.error(err);

  if (res.headersSent) return next(err);

  // Sequelize errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      error: "Risorsa già esistente",
      details: isProd ? undefined : err.errors,
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Errore di validazione",
      details: isProd ? undefined : err.errors,
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      error: "Vincolo FK violato",
      details: isProd ? undefined : err.fields,
    });
  }

  // Errore generico
  res.status(500).json({
    error: "Internal Server Error",
    details: isProd ? undefined : err.message,
  });
};
