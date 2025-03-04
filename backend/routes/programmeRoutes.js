const express = require('express');
const programmeController = require('../controllers/ProgrammeController');
const router = express.Router();

router.post('/new', programmeController.createProgramme); // Créer un programme
router.get('/', programmeController.getAllProgrammes); // Récupérer les programmes
router.get('/:id', programmeController.getProgrammeByPk); // Récupérer un programme par son ID
router.put('/:id', programmeController.updateProgramme); // Mettre à jour un programme
router.delete('/delete/:id', programmeController.deleteProgramme); // Supprimer un programme

module.exports = router;
