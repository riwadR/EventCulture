const express = require('express');
const router = express.Router();
const oeuvreCategorieController = require('../controllers/oeuvreCategorieController');

router.get('/', oeuvreCategorieController.getAllOeuvreCategories);
router.get('/:id_oeuvre/:id_categorie', oeuvreCategorieController.getOeuvreCategorie);
router.post('/', oeuvreCategorieController.createOeuvreCategorie);
router.delete('/:id_oeuvre/:id_categorie', oeuvreCategorieController.deleteOeuvreCategorie);

module.exports = router;