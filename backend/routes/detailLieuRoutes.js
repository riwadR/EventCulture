const express = require('express');
const router = express.Router();
const detailLieuController = require('../controllers/detailLieuController');

// Routes CRUD principales
router.get('/', detailLieuController.getAllDetailLieux);
router.get('/:id', detailLieuController.getDetailLieuById);
router.post('/', detailLieuController.createDetailLieu);
router.put('/:id', detailLieuController.updateDetailLieu);
router.delete('/:id', detailLieuController.deleteDetailLieu);

// Routes utilitaires
router.get('/filter/by-note', detailLieuController.getDetailLieuxByNote);
router.patch('/:id/note', detailLieuController.updateNoteMoyenne);
router.get('/search/query', detailLieuController.searchDetailLieux);

module.exports = router;