const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const createAuthMiddleware = require('../middlewares/authMiddleware'); // Factory function
const validationMiddleware = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

const initUserRoutes = (models) => {
  // CORRECTION: Initialiser authMiddleware avec les modèles
  const authMiddleware = createAuthMiddleware(models);
  const userController = new UserController(models);

  // Validation pour l'inscription
  const registerValidation = [
    body('nom').trim().isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
    body('prenom').trim().isLength({ min: 2, max: 100 }).withMessage('Le prénom doit contenir entre 2 et 100 caractères'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('telephone').optional().isMobilePhone('any').withMessage('Numéro de téléphone invalide'),
    body('type_user').isIn(['ecrivain', 'journaliste', 'scientifique', 'acteur', 'artiste', 'artisan', 'realisateur', 'musicien', 'photographe', 'danseur', 'sculpteur', 'visiteur']).withMessage('Type d\'utilisateur invalide')
  ];

  // Validation pour la connexion
  const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 1 }).withMessage('Mot de passe requis')
  ];

  // Routes publiques
  router.post('/register', 
    registerValidation,
    validationMiddleware.handleValidationErrors,
    userController.createUser.bind(userController)
  );

  router.post('/login', 
    loginValidation,
    validationMiddleware.handleValidationErrors,
    userController.loginUser.bind(userController)
  );

  // Routes protégées pour utilisateurs connectés
  router.get('/profile', 
    authMiddleware.authenticate,
    userController.getProfile.bind(userController)
  );

  router.put('/profile', 
    authMiddleware.authenticate,
    [
      body('nom').optional().trim().isLength({ min: 2, max: 100 }),
      body('prenom').optional().trim().isLength({ min: 2, max: 100 }),
      body('telephone').optional().isMobilePhone('any'),
      body('biographie').optional().isLength({ max: 2000 }),
      body('type_user').optional().isIn(['ecrivain', 'journaliste', 'scientifique', 'acteur', 'artiste', 'artisan', 'realisateur', 'musicien', 'photographe', 'danseur', 'sculpteur', 'visiteur'])
    ],
    validationMiddleware.handleValidationErrors,
    userController.updateProfile.bind(userController)
  );

  router.patch('/change-password', 
    authMiddleware.authenticate,
    [
      body('current_password').isLength({ min: 1 }).withMessage('Mot de passe actuel requis'),
      body('new_password').isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    ],
    validationMiddleware.handleValidationErrors,
    userController.changePassword.bind(userController)
  );

  // Routes pour admins uniquement
  router.get('/', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    userController.getAllUsers.bind(userController)
  );

  router.get('/pending-professionals', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    userController.getPendingProfessionals.bind(userController)
  );

  router.patch('/:id/validate-professional', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    [
      body('valide').isBoolean().withMessage('Le champ valide doit être un booléen'),
      body('raison_rejet').optional().isLength({ max: 1000 }).withMessage('Raison de rejet trop longue')
    ],
    validationMiddleware.handleValidationErrors,
    userController.validateProfessional.bind(userController)
  );

  // Route publique pour voir un profil utilisateur
  router.get('/:id', 
    userController.getUserById.bind(userController)
  );

  console.log('✅ Routes utilisateurs initialisées avec authMiddleware');

  return router;
};

module.exports = initUserRoutes;