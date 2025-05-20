// routes/eventRoutes.js

const express = require('express');
const router = express.Router();

const evenementController = require('../controllers/EventController');

// Routes événements
router.post('/evenements', evenementController.createEvenement);
router.get('/evenements', evenementController.getAllEvenements);
router.get('/evenements/:id', evenementController.getEvenementById);
router.put('/evenements/:id', evenementController.updateEvenement);
router.delete('/evenements/:id', evenementController.deleteEvenement);

// Ajouter un participant (et œuvre optionnelle) à un événement
router.post('/evenements/:id/participants', evenementController.addParticipantToEvenement);

// Associer une œuvre existante d’un participant à un événement
router.post('/evenements/:id/participants/:id_user/oeuvres/:id_oeuvre', evenementController.addParticipantOeuvreToEvenement);

module.exports = router;
