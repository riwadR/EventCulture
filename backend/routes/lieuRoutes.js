const express = require('express');
const router = express.Router();
const lieuController = require('../controllers/lieuController');

router.get('/', lieuController.getAllLieux);
router.get('/:id', lieuController.getLieuById);
router.post('/', lieuController.createLieu);
router.put('/:id', lieuController.updateLieu);
router.delete('/:id', lieuController.deleteLieu);

module.exports = router;