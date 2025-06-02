const express = require('express');
const router = express.Router();
const PatrimoineController = require('../controllers/patrimoineController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

const initPatrimoineRoutes = (models) => {
  const patrimoineController = new PatrimoineController(models);

  // Routes publiques - consultation du patrimoine

  // Vue d'ensemble du patrimoine
  router.get('/', patrimoineController.getAllSitesPatrimoniaux.bind(patrimoineController));
  
  // Détails d'un site patrimonial
  router.get('/sites/:id', 
    validationMiddleware.validateId('id'),
    patrimoineController.getSitePatrimonialById.bind(patrimoineController)
  );

  // Galerie de médias d'un site
  router.get('/sites/:id/galerie', 
    validationMiddleware.validateId('id'),
    patrimoineController.getGalerieSite.bind(patrimoineController)
  );

  // Monuments par type
  router.get('/monuments/:type', patrimoineController.getMonumentsByType.bind(patrimoineController));

  // Vestiges par type  
  router.get('/vestiges/:type', patrimoineController.getVestigesByType.bind(patrimoineController));

  // Recherche avancée dans le patrimoine
  router.get('/recherche', patrimoineController.recherchePatrimoine.bind(patrimoineController));

  // Statistiques du patrimoine
  router.get('/statistiques', patrimoineController.getStatistiquesPatrimoine.bind(patrimoineController));

  // Sites populaires
  router.get('/populaires', patrimoineController.getSitesPopulaires.bind(patrimoineController));

  // Parcours patrimoniaux
  router.get('/parcours', patrimoineController.getParcoursPatrimoniaux.bind(patrimoineController));

  return router;
};

module.exports = initPatrimoineRoutes;

// routes/index.js - Mise à jour pour inclure les routes patrimoine
const express = require('express');
const router = express.Router();

const initOeuvreRoutes = require('./oeuvreRoutes');
const initUserRoutes = require('./userRoutes');
const initEvenementRoutes = require('./evenementRoutes');
const initLieuRoutes = require('./lieuRoutes');
const initPatrimoineRoutes = require('./patrimoineRoutes'); // Nouveau
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

  // Documentation API mise à jour
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
        patrimoine: 'GET /api/patrimoine', // Nouveau
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
  router.use('/patrimoine', initPatrimoineRoutes(models)); // Nouveau
  router.use('/commentaires', initCommentaireRoutes(models));

  return router;
};

module.exports = initRoutes;