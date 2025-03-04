// routes/parcoursLieuxRoutes.js
const express = require('express');
const parcoursLieuxController = require('../controllers/ParcoursLieuxController');
const router = express.Router();

router.get('/:id', parcoursLieuxController.getParcoursLieuxById); // Récupérer un parcours-lieu par son ID
router.get('/', parcoursLieuxController.getAllParcoursLieux); // Récupérer la liste des parcours-lieux
router.delete('/delete/:id', parcoursLieuxController.deleteParcoursLieux); // Supprimer un parcours-lieu
router.put('/:id', parcoursLieuxController.updateParcoursLieux); // Mettre à jour un parcours-lieu
router.post('/new', parcoursLieuxController.createParcoursLieux); // Créer un parcours-lieu

module.exports = router;
