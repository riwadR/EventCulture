// server.js - Point d'entrée du serveur
const App = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;
let appInstance;

const startServer = async () => {
  try {
    // Initialiser l'application
    appInstance = new App();
    const app = await appInstance.initialize();

    // Démarrer le serveur
    server = app.listen(PORT, HOST, () => {
      console.log(`🌟 Serveur Action Culture démarré !`);
      console.log(`🔗 URL: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
      console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api`);
      console.log(`❤️  Santé: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/health`);
      console.log(`🔍 Recherche: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api/search`);
      
      // Afficher les statistiques de base si disponibles
      setTimeout(async () => {
        try {
          const models = appInstance.getModels();
          const stats = {
            oeuvres: await models.Oeuvre.count({ where: { statut: 'publie' } }),
            evenements: await models.Evenement.count(),
            utilisateurs: await models.User.count(),
            lieux: await models.Lieu.count()
          };
          console.log(`📈 Statistiques: ${stats.oeuvres} œuvres, ${stats.evenements} événements, ${stats.utilisateurs} utilisateurs, ${stats.lieux} lieux`);
        } catch (error) {
          // Ignorer les erreurs de stats
        }
      }, 2000);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé`);
      } else {
        console.error('❌ Erreur du serveur:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des arrêts gracieux
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Signal ${signal} reçu, arrêt du serveur...`);
  
  if (server) {
    server.close(async () => {
      console.log('🔌 Serveur HTTP fermé');
      
      if (appInstance) {
        await appInstance.closeDatabase();
      }
      
      console.log('👋 Arrêt complet du serveur');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Gestionnaires de signaux
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Gestionnaire d'erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}

module.exports = {
  startServer,
  gracefulShutdown
};

// ecosystem.config.js - Configuration PM2 (optionnel)
module.exports = {
  apps: [
    {
      name: 'action-culture-api',
      script: './server.js',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: process.env.NODE_ENV === 'production' ? 'cluster' : 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};