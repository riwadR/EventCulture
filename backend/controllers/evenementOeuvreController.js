const { EvenementOeuvre } = require('../models');

exports.getAllEvenementOeuvres = async (req, res) => {
  try {
    const evenementOeuvres = await EvenementOeuvre.findAll({
      include: [
        { model: EvenementOeuvre.associations.Evenement },
        { model: EvenementOeuvre.associations.Oeuvre },
        { model: EvenementOeuvre.associations.Presentateur }
      ]
    });
    res.status(200).json(evenementOeuvres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des relations événement-oeuvre' });
  }
};

exports.getEvenementOeuvre = async (req, res) => {
  try {
    const { id_evenement, id_oeuvre } = req.params;
    const evenementOeuvre = await EvenementOeuvre.findOne({
      where: { id_evenement, id_oeuvre },
      include: [
        { model: EvenementOeuvre.associations.Evenement },
        { model: EvenementOeuvre.associations.Oeuvre },
        { model: EvenementOeuvre.associations.Presentateur }
      ]
    });
    if (evenementOeuvre) {
      res.status(200).json(evenementOeuvre);
    } else {
      res.status(404).json({ error: 'Relation événement-oeuvre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la relation événement-oeuvre' });
  }
};

exports.createEvenementOeuvre = async (req, res) => {
  try {
    const { id_evenement, id_oeuvre, id_presentateur } = req.body;
    const newEvenementOeuvre = await EvenementOeuvre.create({
      id_evenement,
      id_oeuvre,
      id_presentateur
    });
    res.status(201).json(newEvenementOeuvre);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de la relation événement-oeuvre' });
  }
};

exports.updateEvenementOeuvre = async (req, res) => {
  try {
    const { id_evenement, id_oeuvre } = req.params;
    const { id_presentateur } = req.body;
    const evenementOeuvre = await EvenementOeuvre.findOne({
      where: { id_evenement, id_oeuvre }
    });
    if (evenementOeuvre) {
      await evenementOeuvre.update({ id_presentateur });
      res.status(200).json(evenementOeuvre);
    } else {
      res.status(404).json({ error: 'Relation événement-oeuvre non trouvée' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la relation événement-oeuvre' });
  }
};

exports.deleteEvenementOeuvre = async (req, res) => {
  try {
    const { id_evenement, id_oeuvre } = req.params;
    const evenementOeuvre = await EvenementOeuvre.findOne({
      where: { id_evenement, id_oeuvre }
    });
    if (evenementOeuvre) {
      await evenementOeuvre.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Relation événement-oeuvre non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la relation événement-oeuvre' });
  }
};