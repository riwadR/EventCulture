const express = require('express');
const router = express.Router();
const evenementOrganisationController = require('../controllers/evenementOrganisationController');

router.get('/', evenementOrganisationController.getAllEvenementOrganisations);
router.get('/:id', evenementOrganisationController.getEvenementOrganisationById);
router.post('/', evenementOrganisationController.createEvenementOrganisation);
router.put('/:id', evenementOrganisationController.updateEvenementOrganisation);
router.delete('/:id', evenementOrganisationController.deleteEvenementOrganisation);

module.exports = router;