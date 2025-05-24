const express = require('express');
const router = express.Router();
const oeuvreArtController = require('../controllers/oeuvreArtController');

router.get('/', oeuvreArtController.getAllOeuvreArts);
router.get('/:id', oeuvreArtController.getOeuvreArtById);
router.post('/', oeuvreArtController.createOeuvreArt);
router.put('/:id', oeuvreArtController.updateOeuvreArt);
router.delete('/:id', oeuvreArtController.deleteOeuvreArt);

module.exports = router;