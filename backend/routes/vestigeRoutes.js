const express = require('express');
const router = express.Router();
const vestigeController = require('../controllers/vestigeController');

router.post('/', vestigeController.createVestige);
router.get('/', vestigeController.getAllVestiges);
router.get('/:id', vestigeController.getVestigeById);
router.put('/:id', vestigeController.updateVestige);
router.delete('/:id', vestigeController.deleteVestige);

module.exports = router;
