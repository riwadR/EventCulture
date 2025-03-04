const express = require('express');
const catalogueController = require('../controllers/CatalogueController');
const router = express.Router();

router.get('/:id', catalogueController.getCatalogueById); // Récupérer un catalogue par son ID
router.get('/', catalogueController.getAllCatalogues); // Récupérer la liste des catalogues
router.delete('/delete/:id', catalogueController.deleteCatalogue); // Supprimer un catalogue
router.put('/:id', catalogueController.updateCatalogue); // Mettre à jour un catalogue
router.post('/new', catalogueController.createCatalogue); // Créer un catalogue

module.exports = router;
