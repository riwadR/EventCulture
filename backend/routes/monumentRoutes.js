const express = require('express');
const router = express.Router();
const monumentController = require('../controllers/monumentController');

router.post('/', monumentController.createMonument);
router.get('/', monumentController.getAllMonuments);
router.get('/:id', monumentController.getMonumentById);
router.put('/:id', monumentController.updateMonument);
router.delete('/:id', monumentController.deleteMonument);

module.exports = router;
