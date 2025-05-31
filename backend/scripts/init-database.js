// scripts/init-database.js
require('dotenv').config();
const { initializeDatabase } = require('../models');

const main = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    const config = {
      database: process.env.DB_NAME || 'actionculture',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      logging: false
    };
    
    const { sequelize } = await initializeDatabase(config);
    await sequelize.close();
    console.log('✅ Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

main();