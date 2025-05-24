const express = require('express');
const router = express.Router();
const lieuMediaController = require('../controllers/lieuMediaController');

// Routes CRUD principales
router.get('/', lieuMediaController.getAllLieuMedias);
router.get('/:id', lieuMediaController.getLieuMediaById);
router.post('/', lieuMediaController.createLieuMedia);
router.put('/:id', lieuMediaController.updateLieuMedia);
router.delete('/:id', lieuMediaController.deleteLieuMedia);

// Routes utilitaires - filtrage par lieu
router.get('/lieu/:lieuId', lieuMediaController.getMediasByLieu);

// Routes utilitaires - filtrage par type
router.get('/type/:type', lieuMediaController.getMediasByType);

// Route de création en lot
router.post('/bulk/create', lieuMediaController.bulkCreateLieuMedias);

// Route de statistiques
router.get('/stats/general', lieuMediaController.getMediaStats);

module.exports = router;