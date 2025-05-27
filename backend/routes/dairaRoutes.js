const express = require('express');
const router = express.Router();
const dairaController = require('../controllers/dairaController');

// Routes CRUD principales
router.get('/', dairaController.getAllDairas);
router.get('/:id', dairaController.getDairaById);
router.post('/', dairaController.createDaira);
router.put('/:id', dairaController.updateDaira);
router.delete('/:id', dairaController.deleteDaira);

// Routes utilitaires - filtrage par wilaya
router.get('/wilaya/:wilayaId', dairaController.getDairasByWilaya);

// Route de recherche
router.get('/search/query', dairaController.searchDairas);

// Routes de statistiques
router.get('/stats/wilaya/:wilayaId', dairaController.getDairaStats);
router.get('/stats/general', dairaController.getDairaStats);

module.exports = router;