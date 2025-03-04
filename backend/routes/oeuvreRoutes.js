const express = require('express');
const oeuvreController = require('../controllers/OeuvreController');
const router = express.Router();

router.post('/new', oeuvreController.createOeuvre); // Créer une oeuvre
router.get('/', oeuvreController.getAllOeuvres); // Récupérer toutes les oeuvres
router.delete('/delete/:id', oeuvreController.deleteOeuvre); // Supprimer une oeuvre par son ID
router.put('/:id', oeuvreController.updateOeuvre); // Mettre à jour une oeuvre
router.get('/:id', oeuvreController.getOeuvreByPk); // Récupérer une oeuvre par son ID

module.exports = router;