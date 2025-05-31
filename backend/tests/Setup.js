require('dotenv').config({ path: '.env.test' });
const { initializeDatabase } = require('../models');

let sequelize, models;

// Configuration pour les tests
const testDbConfig = {
  database: process.env.TEST_DB_NAME || 'actionculture_test',
  username: process.env.TEST_DB_USER || process.env.DB_USER || 'root',
  password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD || '',
  host: process.env.TEST_DB_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || process.env.DB_PORT) || 3306,
  logging: false,
  sync: { force: true } // Recréer les tables à chaque test
};

// Fonction pour initialiser la base de test
const setupTestDatabase = async () => {
  if (!sequelize) {
    const result = await initializeDatabase(testDbConfig);
    sequelize = result.sequelize;
    models = result.models;
  }
  return { sequelize, models };
};

// Fonction pour nettoyer après les tests
const teardownTestDatabase = async () => {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    models = null;
  }
};

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  testDbConfig
};