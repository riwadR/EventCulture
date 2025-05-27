const express = require('express');
const router = express.Router();
const evenementOeuvreController = require('../controllers/evenementOeuvreController');

router.get('/', evenementOeuvreController.getAllEvenementOeuvres);
router.get('/:id_evenement/:id_oeuvre', evenementOeuvreController.getEvenementOeuvre);
router.post('/', evenementOeuvreController.createEvenementOeuvre);
router.put('/:id_evenement/:id_oeuvre', evenementOeuvreController.updateEvenementOeuvre);
router.delete('/:id_evenement/:id_oeuvre', evenementOeuvreController.deleteEvenementOeuvre);

module.exports = router;