require('dotenv').config();
const { resetDatabase } = require('../models');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = async () => {
  try {
    console.log('⚠️  ATTENTION: Cette action va supprimer toutes les données !');
    
    const answer = await new Promise(resolve => {
      rl.question('Êtes-vous sûr de vouloir continuer ? (oui/non): ', resolve);
    });
    
    if (answer.toLowerCase() !== 'oui') {
      console.log('❌ Opération annulée');
      process.exit(0);
    }
    
    console.log('🗑️  Remise à zéro en cours...');
    
    const config = {
      database: process.env.DB_NAME || 'actionculture',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      logging: false
    };
    
    const { sequelize } = await resetDatabase(config);
    await sequelize.close();
    console.log('✅ Base de données remise à zéro avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

main();