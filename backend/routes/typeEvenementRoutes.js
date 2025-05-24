const express = require('express');
const router = express.Router();
const utc = require('dayjs/plugin/utc')
const dayjs = require('dayjs').extend(utc)
const typeEvenementController = require('../controllers/typeEvenementController');

router.get('/', typeEvenementController.getAllTypeEvenements);
router.get('/:id', typeEvenementController.getTypeEvenementById);
router.post('/', typeEvenementController.createTypeEvenement);
router.put('/:id', typeEvenementController.updateTypeEvenement);
router.delete('/:id', typeEvenementController.deleteTypeEvenement);

module.exports = router;