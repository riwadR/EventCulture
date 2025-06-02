// routes/oeuvreRoutes.js - Routes œuvres avec permissions mises à jour
const express = require('express');
const router = express.Router();
const OeuvreController = require('../controllers/oeuvreController');
const createAuthMiddleware = require('../middlewares/authMiddleware'); // Factory function
const validationMiddleware = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

const initOeuvreRoutes = (models) => {
  // CORRECTION: Initialiser authMiddleware avec les modèles
  const authMiddleware = createAuthMiddleware(models);
  const oeuvreController = new OeuvreController(models);

  // Validation pour la création d'œuvre
  const createOeuvreValidation = [
    body('titre').trim().isLength({ min: 1, max: 255 }).withMessage('Le titre est obligatoire (max 255 caractères)'),
    body('id_type_oeuvre').isInt().withMessage('Type d\'œuvre invalide'),
    body('id_langue').isInt().withMessage('Langue invalide'),
    body('annee_creation').optional().isInt({ min: -3000, max: new Date().getFullYear() }).withMessage('Année de création invalide'),
    body('description').optional().isLength({ max: 5000 }).withMessage('Description trop longue (max 5000 caractères)')
  ];

  // Routes publiques (consultation)
  router.get('/', oeuvreController.getAllOeuvres.bind(oeuvreController));
  router.get('/search', oeuvreController.searchOeuvres.bind(oeuvreController));
  router.get('/:id', oeuvreController.getOeuvreById.bind(oeuvreController));

  // Routes pour professionnels validés uniquement
  router.post('/', 
    authMiddleware.authenticate,
    authMiddleware.requireValidatedProfessional,
    createOeuvreValidation,
    validationMiddleware.handleValidationErrors,
    oeuvreController.createOeuvre.bind(oeuvreController)
  );

  router.put('/:id', 
    authMiddleware.authenticate,
    authMiddleware.requireValidatedProfessional,
    authMiddleware.requireOwnership('Oeuvre', 'id', 'saisi_par'),
    oeuvreController.updateOeuvre.bind(oeuvreController)
  );

  router.delete('/:id', 
    authMiddleware.authenticate,
    authMiddleware.requireValidatedProfessional,
    authMiddleware.requireOwnership('Oeuvre', 'id', 'saisi_par'),
    oeuvreController.deleteOeuvre.bind(oeuvreController)
  );

  // Routes pour admins (modération)
  router.patch('/:id/validate', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    [
      body('statut').isIn(['publie', 'rejete']).withMessage('Statut invalide'),
      body('raison_rejet').optional().isLength({ max: 1000 }).withMessage('Raison de rejet trop longue')
    ],
    validationMiddleware.handleValidationErrors,
    oeuvreController.validateOeuvre.bind(oeuvreController)
  );

  console.log('✅ Routes œuvres initialisées avec authMiddleware');
  
  return router;
};

module.exports = initOeuvreRoutes;