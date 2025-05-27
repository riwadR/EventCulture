const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisationController');

router.get('/', organisationController.getAllOrganisations);
router.get('/:id', organisationController.getOrganisationById);
router.post('/', organisationController.createOrganisation);
router.put('/:id', organisationController.updateOrganisation);
router.delete('/:id', organisationController.deleteOrganisation);

module.exports = router;