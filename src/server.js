const app = require("./app");
const { sequelize } = require("./models");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (process.env.NODE_ENV === "production") {
      await sequelize.sync();
      console.log("Database sincronizzato (produzione)");
    } else {
      await sequelize.sync({ alter: true });
      console.log("Database sincronizzato (sviluppo con alter:true)");
    }

    app.listen(PORT, () => {
      console.log(`Server in esecuzione su http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Errore sincronizzazione DB:", err);
    process.exit(1);
  }
}

startServer();
