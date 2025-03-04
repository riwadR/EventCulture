const express = require('express');
const participantController = require('../controllers/ParticipantController');
const router = express.Router();

router.get('/:id', participantController.getParticipantById); // Récupérer un participant par son ID
router.get('/', participantController.getAllParticipants); // Récupérer la liste des participants
router.delete('/delete/:id', participantController.deleteParticipant); // Supprimer un participant
router.put('/:id', participantController.updateParticipant); // Mettre à jour un participant
router.post('/new', participantController.createParticipant); // Créer un participant

module.exports = router;
