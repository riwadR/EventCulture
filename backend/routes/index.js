// routes/index.js - Fichier principal des routes mis à jour
const express = require('express');
const router = express.Router();

const initOeuvreRoutes = require('./oeuvreRoutes');
const initUserRoutes = require('./userRoutes');
const initEvenementRoutes = require('./evenementRoutes');
const initLieuRoutes = require('./lieuRoutes');
const initCommentaireRoutes = require('./commentaireRoutes');
const initMetadataRoutes = require('./metadataRoutes');

const initRoutes = (models) => {
  // Route de santé
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'Connected'
    });
  });

  // Documentation API
  router.get('/', (req, res) => {
    res.json({
      message: 'API Action Culture - Système de gestion culturelle',
      version: '1.0.0',
      permissions: {
        admin: 'Peut tout gérer sur la plateforme, valide les professionnels',
        professionnel: 'Peut créer des œuvres, événements (si lié à organisation)',
        visiteur: 'Peut consulter et commenter les œuvres et événements'
      },
      endpoints: {
        health: 'GET /api/health',
        metadata: 'GET /api/metadata',
        oeuvres: 'GET /api/oeuvres',
        users: 'GET /api/users',
        evenements: 'GET /api/evenements',
        lieux: 'GET /api/lieux',
        commentaires: 'GET /api/commentaires'
      }
    });
  });

  // Monter les routes spécialisées
  router.use('/metadata', initMetadataRoutes(models));
  router.use('/oeuvres', initOeuvreRoutes(models));
  router.use('/users', initUserRoutes(models));
  router.use('/evenements', initEvenementRoutes(models));
  router.use('/lieux', initLieuRoutes(models));
  router.use('/commentaires', initCommentaireRoutes(models));

  return router;
};

module.exports = initRoutes;