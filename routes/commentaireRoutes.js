const express = require('express');
const commentaireController = require('../controllers/CommentaireController');
const router = express.Router();

router.get('/:id', commentaireController.getCommentaireById); // Récupérer un commentaire par son ID
router.get('/', commentaireController.getAllCommentaires); // Récupérer la liste des commentaires
router.delete('/delete/:id', commentaireController.deleteCommentaire); // Supprimer un commentaire
router.put('/:id', commentaireController.updateCommentaire); // Mettre à jour un commentaire
router.post('/new', commentaireController.createCommentaire); // Créer un commentaire

module.exports = router;
