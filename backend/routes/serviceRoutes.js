const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Récupérer tous les services avec leur lieu associé
router.get('/', serviceController.getAllServices);

// Récupérer un service par son id
router.get('/:id', serviceController.getServiceById);

// Créer un nouveau service
router.post('/', serviceController.createService);

// Mettre à jour un service existant
router.put('/:id', serviceController.updateService);

// Supprimer un service
router.delete('/:id', serviceController.deleteService);

module.exports = router;
