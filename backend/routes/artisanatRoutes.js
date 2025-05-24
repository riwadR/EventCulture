const express = require('express');
const router = express.Router();
const artisanatController = require('../controllers/artisanatController');

router.get('/', artisanatController.getAllArtisanats);
router.get('/:id', artisanatController.getArtisanatById);
router.post('/', artisanatController.createArtisanat);
router.put('/:id', artisanatController.updateArtisanat);
router.delete('/:id', artisanatController.deleteArtisanat);

module.exports = router;