const express = require('express');
const router = express.Router();
const wilayaController = require('../controllers/wilayaController');

router.get('/', wilayaController.getAllWilayas);
router.get('/:id', wilayaController.getWilayaById);
router.post('/', wilayaController.createWilaya);
router.put('/:id', wilayaController.updateWilaya);
router.delete('/:id', wilayaController.deleteWilaya);

module.exports = router;