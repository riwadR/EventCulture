const express = require('express');
const router = express.Router();
const evenementUserController = require('../controllers/evenementUserController');

router.get('/', evenementUserController.getAllEvenementUsers);
router.get('/:id_evenement/:id_user', evenementUserController.getEvenementUser);
router.post('/', evenementUserController.createEvenementUser);
router.put('/:id_evenement/:id_user', evenementUserController.updateEvenementUser);
router.delete('/:id_evenement/:id_user', evenementUserController.deleteEvenementUser);

module.exports = router;