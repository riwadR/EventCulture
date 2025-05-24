const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');

router.get('/', filmController.getAllFilms);
router.get('/:id', filmController.getFilmById);
router.post('/', filmController.createFilm);
router.put('/:id', filmController.updateFilm);
router.delete('/:id', filmController.deleteFilm);

module.exports = router;