const express = require('express');
const router = express.Router();
const LieuController = require('../controllers/LieuController');
const createAuthMiddleware = require('../middlewares/authMiddleware'); // Factory function
const validationMiddleware = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

const initLieuRoutes = (models) => {
  // CORRECTION: Initialiser authMiddleware avec les modèles
  const authMiddleware = createAuthMiddleware(models);
  const lieuController = new LieuController(models);

  // Validation pour la création de lieu
  const createLieuValidation = [
    body('nom').trim().isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères'),
    body('adresse').trim().isLength({ min: 5, max: 255 }).withMessage('L\'adresse doit contenir entre 5 et 255 caractères'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude invalide'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude invalide'),
    body('typeLieu').isIn(['Wilaya', 'Daira', 'Commune']).withMessage('Type de lieu invalide')
  ];

  // Routes publiques
  router.get('/', lieuController.getAllLieux.bind(lieuController));
  router.get('/proximite', lieuController.getLieuxProximite.bind(lieuController));
  router.get('/statistiques', lieuController.getStatistiquesLieux.bind(lieuController));
  router.get('/:id', lieuController.getLieuById.bind(lieuController));

  // Routes protégées
  router.post('/', 
    authMiddleware.authenticate,
    authMiddleware.requireRole(['Contributeur', 'Modérateur', 'Administrateur']),
    createLieuValidation,
    validationMiddleware.handleValidationErrors,
    lieuController.createLieu.bind(lieuController)
  );

  console.log('✅ Routes lieux initialisées avec authMiddleware');

  return router;
};

module.exports = initLieuRoutes;