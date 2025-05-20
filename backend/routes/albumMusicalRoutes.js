const express = require('express');
const router = express.Router();
const albumMusicalController = require('../controllers/albumMusicalController');

router.get('/', albumMusicalController.getAllAlbums);
router.get('/:id', albumMusicalController.getAlbumById);
router.post('/', albumMusicalController.createAlbum);
router.put('/:id', albumMusicalController.updateAlbum);
router.delete('/:id', albumMusicalController.deleteAlbum);

module.exports = router;