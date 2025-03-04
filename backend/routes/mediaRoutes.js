const express = require('express');
const mediaController = require('../controllers/MediaController');
const router = express.Router();

router.get('/:id', mediaController.getMediaById); // Récupérer un média par son ID
router.get('/', mediaController.getAllMedia); // Récupérer la liste des médias
router.delete('/delete/:id', mediaController.deleteMedia); // Supprimer un média
router.put('/:id', mediaController.updateMedia); // Mettre à jour un média
router.post('/new', mediaController.createMedia); // Créer un média

module.exports = router;
