const express = require('express');
const router = express.Router();
const tagMotCleController = require('../controllers/tagMotCleController');

router.get('/', tagMotCleController.getAllTagMotCles);
router.get('/:id', tagMotCleController.getTagMotCleById);
router.post('/', tagMotCleController.createTagMotCle);
router.put('/:id', tagMotCleController.updateTagMotCle);
router.delete('/:id', tagMotCleController.deleteTagMotCle);

module.exports = router;