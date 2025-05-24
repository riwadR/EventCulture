const express = require('express');
const router = express.Router();
const communeController = require('../controllers/communeController');

// Routes CRUD principales
router.get('/', communeController.getAllCommunes);
router.get('/:id', communeController.getCommuneById);
router.post('/', communeController.createCommune);
router.put('/:id', communeController.updateCommune);
router.delete('/:id', communeController.deleteCommune);

// Routes utilitaires - filtrage par daïra
router.get('/daira/:dairaId', communeController.getCommunesByDaira);

// Routes utilitaires - filtrage par wilaya
router.get('/wilaya/:wilayaId', communeController.getCommunesByWilaya);

// Route de recherche
router.get('/search/query', communeController.searchCommunes);

// Routes de statistiques
router.get('/stats/daira/:dairaId', communeController.getCommuneStats);
router.get('/stats/wilaya/:wilayaId', communeController.getCommuneStats);
router.get('/stats/general', communeController.getCommuneStats);

module.exports = router;