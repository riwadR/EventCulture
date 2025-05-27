require("dotenv").config();
const { Sequelize } = require("sequelize");

// Log environment variables for debugging
console.log("Environment variables:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || "(empty)",
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_DIALECT: process.env.DB_DIALECT,
});

// Check for missing environment variables
const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_HOST", "DB_PORT", "DB_DIALECT"];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || undefined, // Handle empty password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false, // Disable SQL logging
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("Connexion à MySQL réussie."))
  .catch((err) => console.error("Impossible de se connecter à la base de données :", err));

module.exports = sequelize;