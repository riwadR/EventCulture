const express = require('express');
const router = express.Router();
const collectionSerieController = require('../controllers/collectionSerieController');

router.get('/', collectionSerieController.getAllCollectionSeries);
router.get('/:id', collectionSerieController.getCollectionSerieById);
router.post('/', collectionSerieController.createCollectionSerie);
router.put('/:id', collectionSerieController.updateCollectionSerie);
router.delete('/:id', collectionSerieController.deleteCollectionSerie);

module.exports = router;