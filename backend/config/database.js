require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false, // Désactiver les logs SQL (optionnel),
});

sequelize
  .authenticate()
  .then(() => console.log("Connexion à PostgreSQL réussie."))
  .catch((err) => console.error("Impossible de se connecter à la base de données :", err));

module.exports = sequelize;
