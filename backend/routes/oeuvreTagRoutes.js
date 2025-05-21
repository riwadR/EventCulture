const express = require('express');
const router = express.Router();
const oeuvreTagController = require('../controllers/oeuvreTagController');

router.get('/', oeuvreTagController.getAllOeuvreTags);
router.get('/:id_oeuvre/:id_tag', oeuvreTagController.getOeuvreTag);
router.post('/', oeuvreTagController.createOeuvreTag);
router.delete('/:id_oeuvre/:id_tag', oeuvreTagController.deleteOeuvreTag);

module.exports = router;