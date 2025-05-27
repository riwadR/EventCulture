const express = require('express');
const router = express.Router();
const parcoursLieuxController = require('../controllers/parcoursLieuxController');

router.get('/', parcoursLieuxController.getAllParcoursLieux);
router.get('/:id', parcoursLieuxController.getParcoursLieuById);
router.post('/', parcoursLieuxController.createParcoursLieu);
router.put('/:id', parcoursLieuxController.updateParcoursLieu);
router.delete('/:id', parcoursLieuxController.deleteParcoursLieu);

module.exports = router;