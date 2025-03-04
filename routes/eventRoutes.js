const express = require('express');
const eventController = require('../controllers/EventController');
const router = express.Router();

router.post('/new', eventController.createEvent); // Créer un event
router.get('/', eventController.getAllEvents); // Récupérer les évènements
router.get('/:id', eventController.getEventById); // Récupérer un event par son ID
router.put('/:id', eventController.updateEvent); // Mettre à jour un event
router.delete('/delete/:id', eventController.deleteEvent); // Supprimer un évènement

module.exports = router;
