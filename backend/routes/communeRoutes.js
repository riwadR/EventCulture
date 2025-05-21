const express = require('express');
const router = express.Router();
const communeController = require('../controllers/communeController');

router.get('/', communeController.getAllCommunes);
router.get('/:id', communeController.getCommuneById);
router.post('/', communeController.createCommune);
router.put('/:id', communeController.updateCommune);
router.delete('/:id', communeController.deleteCommune);

module.exports = router;