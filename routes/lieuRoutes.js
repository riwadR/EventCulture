const express = require('express');
const lieuController = require('../controllers/LieuController');
const router = express.Router();

router.get('/:id', lieuController.getLieuById); // Récupérer un lieu par son ID
router.get('/', lieuController.getAllLieux); // Récupérer la liste des lieux
router.delete('/delete/:id', lieuController.deleteLieu); // Supprimer un lieu
router.put('/:id', lieuController.updateLieu); // Mettre à jour un lieu
router.post('/new', lieuController.createLieu); // Créer un lieu

module.exports = router;