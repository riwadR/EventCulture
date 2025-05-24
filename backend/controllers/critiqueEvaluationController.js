const { CritiqueEvaluation } = require('../models');

exports.getAllCritiqueEvaluations = async (req, res) => {
  try {
    const critiqueEvaluations = await CritiqueEvaluation.findAll({
      include: [
        { model: CritiqueEvaluation.associations.Oeuvre },
        { model: CritiqueEvaluation.associations.User }
      ]
    });
    res.status(200).json(critiqueEvaluations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des critiques' });
  }
};

exports.getCritiqueEvaluationById = async (req, res) => {
  try {
    const critiqueEvaluation = await CritiqueEvaluation.findByPk(req.params.id, {
      include: [
        { model: CritiqueEvaluation.associations.Oeuvre },
        { model: CritiqueEvaluation.associations.User }
      ]
    });
    if (critiqueEvaluation) {
      res.status(200).json(critiqueEvaluation);
    } else {
      res.status(404).json({ error: 'Critique non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la critique' });
  }
};

exports.createCritiqueEvaluation = async (req, res) => {
  try {
    const { id_oeuvre, id_user, note, commentaire } = req.body;
    const newCritiqueEvaluation = await CritiqueEvaluation.create({
      id_oeuvre,
      id_user,
      note,
      commentaire
    });
    res.status(201).json(newCritiqueEvaluation);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la critique' });
  }
};

exports.updateCritiqueEvaluation = async (req, res) => {
  try {
    const { id_oeuvre, id_user, note, commentaire } = req.body;
    const critiqueEvaluation = await CritiqueEvaluation.findByPk(req.params.id);
    if (critiqueEvaluation) {
      await critiqueEvaluation.update({
        id_oeuvre,
        id_user,
        note,
        commentaire
      });
      res.status(200).json(critiqueEvaluation);
    } else {
      res.status(404).json({ error: 'Critique non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la critique' });
  }
};

exports.deleteCritiqueEvaluation = async (req, res) => {
  try {
    const critiqueEvaluation = await CritiqueEvaluation.findByPk(req.params.id);
    if (critiqueEvaluation) {
      await critiqueEvaluation.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Critique non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la critique' });
  }
};