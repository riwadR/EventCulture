const express = require('express');
const router = express.Router();
const oeuvreUserController = require('../controllers/oeuvreUserController');

router.get('/', oeuvreUserController.getAllOeuvreUsers);
router.get('/:id_oeuvre/:id_user', oeuvreUserController.getOeuvreUser);
router.post('/', oeuvreUserController.createOeuvreUser);
router.put('/:id_oeuvre/:id_user', oeuvreUserController.updateOeuvreUser);
router.delete('/:id_oeuvre/:id_user', oeuvreUserController.deleteOeuvreUser);

module.exports = router;