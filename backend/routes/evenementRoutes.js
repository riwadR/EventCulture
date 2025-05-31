// routes/evenementRoutes.js - Routes événements avec permissions mises à jour
const express = require('express');
const router = express.Router();
const EvenementController = require('../controllers/evenementController');
const createAuthMiddleware = require('../middlewares/authMiddleware'); // Factory function
const validationMiddleware = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

const initEvenementRoutes = (models) => {
  // CORRECTION: Initialiser authMiddleware avec les modèles
  const authMiddleware = createAuthMiddleware(models);
  const evenementController = new EvenementController(models);

  // Validation pour la création d'événement
  const createEvenementValidation = [
    body('nom_evenement').trim().isLength({ min: 3, max: 255 }).withMessage('Le nom de l\'événement doit contenir entre 3 et 255 caractères'),
    body('description').optional().isLength({ max: 5000 }).withMessage('Description trop longue'),
    body('id_lieu').isInt().withMessage('Lieu invalide'),
    body('id_type_evenement').isInt().withMessage('Type d\'événement invalide'),
    body('date_debut').optional().isISO8601().withMessage('Date de début invalide'),
    body('date_fin').optional().isISO8601().withMessage('Date de fin invalide'),
    body('contact_email').optional().isEmail().withMessage('Email de contact invalide')
  ];

  // Routes publiques
  router.get('/', evenementController.getAllEvenements.bind(evenementController));
  router.get('/upcoming', evenementController.getEvenementsAvenir.bind(evenementController));
  router.get('/:id', evenementController.getEvenementById.bind(evenementController));

  // Routes pour professionnels validés avec organisation uniquement
  router.post('/', 
    authMiddleware.authenticate,
    authMiddleware.requireValidatedProfessional,
    authMiddleware.requireOrganizationMembership,
    createEvenementValidation,
    validationMiddleware.handleValidationErrors,
    evenementController.createEvenement.bind(evenementController)
  );

  // Modification d'événement - créateur ou admin
  router.put('/:id', 
    authMiddleware.authenticate,
    authMiddleware.requireValidatedProfessional,
    authMiddleware.requireOwnership('Evenement', 'id', 'id_user'),
    evenementController.updateEvenement.bind(evenementController)
  );

  // Inscription à un événement - tous les utilisateurs connectés
  router.post('/:id/inscription', 
    authMiddleware.authenticate,
    [
      body('role_participation').optional().isLength({ min: 1, max: 100 }).withMessage('Rôle de participation invalide')
    ],
    validationMiddleware.handleValidationErrors,
    evenementController.inscrireUtilisateur.bind(evenementController)
  );

  // Validation des participants - créateur de l'événement ou admin
  router.patch('/:id/participants/:userId/validate', 
    authMiddleware.authenticate,
    (req, res, next) => {
      // Vérifier si l'utilisateur est le créateur de l'événement ou admin
      if (req.user.isAdmin) {
        return next();
      }
      // Sinon, vérifier la propriété de l'événement
      return authMiddleware.requireOwnership('Evenement', 'id', 'id_user')(req, res, next);
    },
    [
      body('statut_participation').isIn(['confirme', 'rejete']).withMessage('Statut invalide'),
      body('notes').optional().isLength({ max: 500 }).withMessage('Notes trop longues')
    ],
    validationMiddleware.handleValidationErrors,
    evenementController.validateParticipation.bind(evenementController)
  );

  console.log('✅ Routes événements initialisées avec authMiddleware');

  return router;
};

module.exports = initEvenementRoutes;