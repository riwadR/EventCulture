const express = require('express');
const router = express.Router();
const typeOeuvreController = require('../controllers/typeOeuvreController');

router.get('/', typeOeuvreController.getAllTypeOeuvres);
router.get('/:id', typeOeuvreController.getTypeOeuvreById);
router.post('/', typeOeuvreController.createTypeOeuvre);
router.put('/:id', typeOeuvreController.updateTypeOeuvre);
router.delete('/:id', typeOeuvreController.deleteTypeOeuvre);

module.exports = router;