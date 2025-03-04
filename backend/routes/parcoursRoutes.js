// routes/parcoursRoutes.js
const express = require('express');
const parcoursController = require('../controllers/ParcoursController');
const router = express.Router();

router.get('/:id', parcoursController.getParcoursById); // Récupérer un parcours par son ID
router.get('/', parcoursController.getAllParcours); // Récupérer la liste des parcours
router.delete('/delete/:id', parcoursController.deleteParcours); // Supprimer un parcours
router.put('/:id', parcoursController.updateParcours); // Mettre à jour un parcours
router.post('/new', parcoursController.createParcours); // Créer un parcours

module.exports = router;