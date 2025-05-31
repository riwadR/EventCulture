// routes/commentaireRoutes.js - Nouvelles routes pour les commentaires
const express = require('express');
const router = express.Router();
const CommentaireController = require('../controllers/commentaireController');
const createAuthMiddleware = require('../middlewares/authMiddleware'); // Factory function
const validationMiddleware = require('../middlewares/validationMiddleware');
const { body } = require('express-validator');

const initCommentaireRoutes = (models) => {
  // CORRECTION: Initialiser authMiddleware avec les modèles
  const authMiddleware = createAuthMiddleware(models);
  const commentaireController = new CommentaireController(models);

  // Validation pour les commentaires
  const commentaireValidation = [
    body('contenu').trim().isLength({ min: 1, max: 2000 }).withMessage('Le contenu doit contenir entre 1 et 2000 caractères'),
    body('note_qualite').optional().isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
    body('commentaire_parent_id').optional().isInt().withMessage('ID du commentaire parent invalide')
  ];

  // Routes publiques - consultation des commentaires
  router.get('/oeuvre/:oeuvreId', commentaireController.getCommentairesOeuvre.bind(commentaireController));
  router.get('/evenement/:evenementId', commentaireController.getCommentairesEvenement.bind(commentaireController));

  // Routes pour utilisateurs connectés - création de commentaires
  router.post('/oeuvre/:oeuvreId', 
    authMiddleware.authenticate,
    commentaireValidation,
    validationMiddleware.handleValidationErrors,
    commentaireController.createCommentaireOeuvre.bind(commentaireController)
  );

  router.post('/evenement/:evenementId', 
    authMiddleware.authenticate,
    commentaireValidation,
    validationMiddleware.handleValidationErrors,
    commentaireController.createCommentaireEvenement.bind(commentaireController)
  );

  // Modification/suppression - propriétaire du commentaire ou admin
  router.put('/:id', 
    authMiddleware.authenticate,
    authMiddleware.requireOwnership('Commentaire', 'id', 'id_user'),
    commentaireValidation,
    validationMiddleware.handleValidationErrors,
    commentaireController.updateCommentaire.bind(commentaireController)
  );

  router.delete('/:id', 
    authMiddleware.authenticate,
    authMiddleware.requireOwnership('Commentaire', 'id', 'id_user'),
    commentaireController.deleteCommentaire.bind(commentaireController)
  );

  // Modération - admins uniquement
  router.patch('/:id/moderate', 
    authMiddleware.authenticate,
    authMiddleware.requireAdmin,
    [
      body('statut').isIn(['publie', 'rejete', 'supprime']).withMessage('Statut invalide')
    ],
    validationMiddleware.handleValidationErrors,
    commentaireController.moderateCommentaire.bind(commentaireController)
  );

  console.log('✅ Routes commentaires initialisées avec authMiddleware');

  return router;
};

module.exports = initCommentaireRoutes;