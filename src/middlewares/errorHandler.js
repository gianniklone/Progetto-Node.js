module.exports = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res
      .status(409)
      .json({ error: "Risorsa già esistente", details: err.errors });
  }

  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
};
