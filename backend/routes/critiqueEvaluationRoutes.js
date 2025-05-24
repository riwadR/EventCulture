const express = require('express');
const router = express.Router();
const critiqueEvaluationController = require('../controllers/critiqueEvaluationController');

router.get('/', critiqueEvaluationController.getAllCritiqueEvaluations);
router.get('/:id', critiqueEvaluationController.getCritiqueEvaluationById);
router.post('/', critiqueEvaluationController.createCritiqueEvaluation);
router.put('/:id', critiqueEvaluationController.updateCritiqueEvaluation);
router.delete('/:id', critiqueEvaluationController.deleteCritiqueEvaluation);

module.exports = router;