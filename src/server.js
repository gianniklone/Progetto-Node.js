const app = require("./app");
const sequelize = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database e tabelle sincronizzati");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Errore sincronizzazione db: ", err);
  });
