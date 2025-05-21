const express = require('express');
const router = express.Router();
const dairaController = require('../controllers/dairaController');

router.get('/', dairaController.getAllDairas);
router.get('/:id', dairaController.getDairaById);
router.post('/', dairaController.createDaira);
router.put('/:id', dairaController.updateDaira);
router.delete('/:id', dairaController.deleteDaira);

module.exports = router;